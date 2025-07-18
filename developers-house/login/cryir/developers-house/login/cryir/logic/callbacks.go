package logic

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/rs/zerolog/log"
	openapi "go.developershouse.xyz/login/cryir/go"
)

type TakeServiceUpdate struct {
	openapi.TakeoutServices
	Takeout string `json:"takeout"`
}

func (s *ImplementedApiService) statusUpdate() {

	uploader := s3manager.NewUploaderWithClient(&s.S3)
	deleter := s3manager.NewBatchDeleteWithClient(&s.S3)
	downloader := s3manager.NewDownloaderWithClient(&s.S3)

	sess := session.Must(session.NewSession())
	sign := s3.New(sess, &aws.Config{
		Credentials: credentials.NewStaticCredentialsFromCreds(credentials.Value{
			AccessKeyID:     os.Getenv("TAKEOUT_AWS_ACCESS_KEY_ID"),
			SecretAccessKey: os.Getenv("TAKEOUT_AWS_SECRET_ACCESS_KEY"),
		}),
		S3ForcePathStyle: aws.Bool(true),
		Region:           aws.String("us-east-1"),
		Endpoint:         aws.String("https://s3.developershouse.xyz"),
	})

	// We listen for all the messages in the queue.
	for message := range s.Callbacks {
		ctx := context.Background()
		incomingServiceStatus := TakeServiceUpdate{}
		err := json.Unmarshal(message.Body, &incomingServiceStatus)
		if err != nil {
			log.Err(err)
			continue
		}

		requestContext, _ := context.WithTimeout(ctx, time.Millisecond*500)
		data := s.Redis.Get(requestContext, fmt.Sprintf("cryir:takeout:%s", incomingServiceStatus.Takeout))
		if err != nil {
			log.Err(err)
			continue
		}

		request := openapi.Takeout{}
		requestBytes, err := data.Bytes()
		if err != nil {
			log.Err(err)
			continue
		}
		err = json.Unmarshal(requestBytes, &request)
		if err != nil {
			log.Err(err)
			continue
		}

		found := false
		for i, service := range request.Services {
			if service.Name == incomingServiceStatus.Name {
				found = true
				request.Services[i].Status = incomingServiceStatus.Status
			}
		}

		if !found {
			request.Services = append(request.Services, incomingServiceStatus.TakeoutServices)
		}

		finished := true

		for _, service := range request.Services {
			if service.Status != "finished" {
				finished = false
			}
		}

		if finished {
			prefix := fmt.Sprintf("%s/%s", request.Id, request.User)
			list, err := s.S3.ListObjects(&s3.ListObjectsInput{
				Prefix: &prefix,
				Bucket: aws.String("takeouts"),
			})

			if err != nil {
				s.Redis.Del(requestContext, fmt.Sprintf("cryir:takeout:%s", request.Id))
				log.Err(err)
				continue
			}

			compressed := bytes.Buffer{}
			zipper := zip.NewWriter(&compressed)

			for _, file := range list.Contents {
				downloaded := aws.NewWriteAtBuffer([]byte{})

				_, err = downloader.Download(downloaded, &s3.GetObjectInput{
					Key:    file.Key,
					Bucket: aws.String("takeouts"),
				})
				if err != nil {
					log.Err(err)
					continue
				}

				file, err := zipper.Create(fmt.Sprintf("takeout%s", strings.Replace(*file.Key, prefix, "", 1)))
				if err != nil {
					log.Err(err)
					continue
				}

				_, err = file.Write(downloaded.Bytes())
				if err != nil {
					log.Err(err)
					continue
				}
			}

			err = deleter.Delete(ctx, s3manager.NewDeleteListIterator(&s.S3, &s3.ListObjectsInput{
				Prefix: &prefix,
				Bucket: aws.String("takeouts"),
			}))

			if err != nil {
				log.Err(err)
				continue
			}

			err = zipper.Close()
			if err != nil {
				log.Err(err)
				continue
			}

			expire := time.Now()
			expire.Add(time.Hour * 24 * 7)

			_, err = uploader.Upload(&s3manager.UploadInput{
				Body:    &compressed,
				Bucket:  aws.String("takeouts-final"),
				Key:     aws.String(request.Id + ".zip"),
				Expires: &expire,
			})
			if err != nil {
				log.Err(err)
				continue
			}

			req, _ := sign.GetObjectRequest(&s3.GetObjectInput{
				Bucket: aws.String("takeouts-final"),
				Key:    aws.String(request.Id + ".zip"),
			})

			url, err := req.Presign(7 * 24 * 60 * time.Minute)
			if err != nil {
				log.Err(err)
				continue
			}
			request.Link = url
			request.Status = "finished"

			val, err := json.Marshal(request)
			if err != nil {
				log.Err(err)
				continue
			}

			s.Redis.Set(requestContext, fmt.Sprintf("cryir:takeout:%s", request.Id), val, 7*24*60*time.Minute)
		} else {
			val, err := json.Marshal(request)
			if err != nil {
				log.Err(err)
				continue
			}

			/* 4. We save the new state in redis. */
			err = s.Redis.Set(requestContext, fmt.Sprintf("cryir:takeout:%s", incomingServiceStatus.Takeout), val, time.Hour).Err()
			if err != nil {
				log.Err(err)
				continue
			}
		}

	}
}
