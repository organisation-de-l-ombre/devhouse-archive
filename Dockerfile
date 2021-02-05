FROM helm as build
WORKDIR /app
COPY chart chart
RUN helm package chart && \
        mkdir charts && \
        mv *.tgz charts/ && \
        helm repo index charts --url https://developers-house-dev-deploy-chart.matthieu-dev.xyz/

FROM nginx
COPY --from=build /app/charts /usr/share/nginx/html
