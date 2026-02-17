# Lesson 3 extension tasks

## Deployment patching a pod-destroying surprise
An alternative way of modifying configuration dynamically is via the `kubectl patch` command.
This allows you to target specific fields of the deployment. Consider the 
`ENABLE_POD_DESTROY` environment variable in `manifest.yml`:

```
    env:
    ...
      - name: ENABLE_POD_DESTROY
        value: "false"
```
This can be overriden with the one-liner:
```
kubectl patch deployment kubechaos -p '{"spec":{"template":{"spec":{"containers":[{"name":"app","env":[{"name":"ENABLE_POD_DESTROY","value":"true"}]}]}}}}'
```
Refresh the web page until you see the "DESTROY POD NOW" surprise (credit to milanmlft @RSECon25), and watch the pods in real-time (`kubectl get pods -w`) as you press the button.

*Can you set the `ENABLE_POD_DESTROY` variable in the config map?*

## 📚 Further Reading

- [Official Kubernetes documentation on ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Learn about Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
