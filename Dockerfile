FROM curlimages/curl as build
WORKDIR /app
RUN curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 && \
        chmod 700 get_helm.sh && \
        ./get_helm.sh
COPY chart chart
RUN helm package chart && \
        mkdir charts && \
        mv *.tgz charts/ && \
        helm repo index charts --url https://developers-house-dev-deploy-chart.matthieu-dev.xyz/

FROM nginx
COPY --from=build /app/charts /usr/share/nginx/html
