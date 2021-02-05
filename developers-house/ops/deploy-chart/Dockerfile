FROM curlimages/curl as build
WORKDIR /app
RUN curl -fsSL https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | VERIFY_CHECKSUM=false sh
COPY chart chart
RUN helm package chart && \
        mkdir charts && \
        mv *.tgz charts/ && \
        helm repo index charts --url https://developers-house-dev-deploy-chart.matthieu-dev.xyz/

FROM nginx
COPY --from=build /app/charts /usr/share/nginx/html
