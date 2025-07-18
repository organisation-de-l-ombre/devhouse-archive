FROM curlimages/curl as build
WORKDIR /app
USER root
RUN curl -fsSL https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | VERIFY_CHECKSUM=false sh
COPY chart chart
RUN helm package chart && \
        mkdir charts && \
        mv *.tgz charts/ && \
        helm repo index charts --url https://chart-deploy-prod.developershouse.xyz/

FROM nginx
COPY --from=build /app/charts /usr/share/nginx/html
