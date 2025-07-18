# Gdpr collector

Pour pouvoir traiter des takeout / demandes de supression correctement, le service de gdpr doit pouvoir connaitre tout 
services qui ont besoin d'être appelés afin de récupérer/supprimer les donnéés. Pour faire cela, chaque application peut ajouter des annotations `developershouse.xyz/gdpr-takeout-service` et `developershouse.xyz/gdpr-deletion-service` aux services qui implémentent l'interface gRPC (qui implémente la supression en elle même).

Le premier composant de gdpr-collector est le `service_watcher` qui garde en mémoire tout les services et l'application associée, ainsi que la liste des services pour une tel application.

L'enregistrement se fait comme ceci:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: data-management-service
  annotations:
    developershouse.xyz/gdpr-deletion-service: awesome-app
    developershouse.xyz/gdpr-takeout-service: awesome-app
spec:
  selector:
    app: awesome-app
  ports:
    # Control gRPC implementation
    - protocol: TCP
      port: 80
      targetPort: 9376
```
