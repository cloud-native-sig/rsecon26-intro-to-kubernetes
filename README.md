# 📖 README — KubeChaos @ RSECon26

GitHub Pages - https://cloud-native-sig.github.io/rsecon26-intro-to-kubernetes/

## 🎯 About

KubeChaos is a tiny Node.js single-page app that serves a **random surprise** every time you refresh — random facts, Kubernetes "jokes" (from ChatGPT!) and mini-games.

It’s perfect for testing Kubernetes basics on **Minikube** or running locally in Docker/Podman.

> If you are attending the workshop please make sure you complete the installations under the **Prerequisites** section. The rest of the README will be covered during the workshop.
---

## 🛠 Prerequisites

Before you start, you’ll need:

1. **Container runtime** (choose one):
   * [Docker](https://docs.docker.com/get-docker/)
   * [Podman](https://podman.io/getting-started/installation)
2. **[Minikube](https://minikube.sigs.k8s.io/docs/start/)** (for running in Kubernetes)
3. **[kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)** (CLI for the Kubernetes API)
4. **[Helm](https://helm.sh/docs/intro/install/)** (Package manager for Kubernetes)

---

### 📥 Install Links by OS

#### **Windows**

* Docker Desktop: [https://docs.docker.com/desktop/setup/install/windows-install/](https://docs.docker.com/desktop/setup/install/windows-install/) (Recommended: enable **Settings > Resources WSL integration**)
* Docker Engine inside WSL: [https://minikube.sigs.k8s.io/docs/tutorials/wsl_docker_driver/](https://minikube.sigs.k8s.io/docs/tutorials/wsl_docker_driver/)
* Podman: [https://podman.io/getting-started/installation#installing-on-windows](https://podman.io/getting-started/installation#installing-on-windows)
* Minikube: [https://minikube.sigs.k8s.io/docs/start/#windows](https://minikube.sigs.k8s.io/docs/start/#windows)
* kubectl: [https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)
* helm [https://helm.sh/docs/intro/install/#from-chocolatey-windows](https://helm.sh/docs/intro/install/#from-chocolatey-windows)

#### **macOS**

* Docker Desktop: [https://docs.docker.com/desktop/setup/install/mac-install/](https://docs.docker.com/desktop/setup/install/mac-install/)
* Docker through colima:    [https://colima.run/docs/installation/](https://colima.run/docs/installation/)
* Podman: [https://podman.io/getting-started/installation#installing-on-macos](https://podman.io/getting-started/installation#installing-on-macos)
* Minikube: [https://minikube.sigs.k8s.io/docs/start/#macos](https://minikube.sigs.k8s.io/docs/start/#macos)
* kubectl: [https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)
* helm: [https://helm.sh/docs/intro/install/#from-homebrew-macos](https://helm.sh/docs/intro/install/#from-homebrew-macos)

#### **Linux**

* Docker Desktop: [https://docs.docker.com/desktop/setup/install/linux/](https://docs.docker.com/desktop/setup/install/linux/)
* Docker Engine: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)
* Podman: [https://podman.io/getting-started/installation#installing-on-linux](https://podman.io/getting-started/installation#installing-on-linux)
* Minikube: [https://minikube.sigs.k8s.io/docs/start/#linux](https://minikube.sigs.k8s.io/docs/start/#linux)
* kubectl: [https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
* helm: [https://helm.sh/docs/intro/install/#from-script](https://helm.sh/docs/intro/install/#from-script)
---

> You are now ready for the workshop. The following may provide a helpful
> reference at a later date.

## ☸ Running on Minikube

```bash
# Start Minikube
minikube start

# Build the container image
minikube image build -t local/kubechaos:v1 image

# Deploy the app to kubernetes
kubectl apply -f deployment/manifests.yaml

# Wait for it to start
kubectl wait --for=condition=ready pod -l app=kubechaos

# Open the service in your browser
minikube service kubechaos-svc
```

Open the URL in your browser — every refresh is a new surprise 🎲

---

## 🚀 Scaling the deployment

* Scale the deployment to demonstrate load balancing:

  ```bash
  kubectl scale deployment kubechaos --replicas=3
  ```
* Refresh multiple times — different pods may serve different surprises.
* Use this as an intro to **rolling updates** by rebuilding the image with new surprises and running:

  ```bash
  kubectl set image deployment/kubechaos kubechaos=<your-new-image>
  ```

---

## 🔄 Deploying updates

```bash
# Rebuild the image (not changing the tag, for simplicity)
minikube image build -t local/kubechaos:v1 image

# Restart the deployment
kubectl rollout restart deploy kubechaos

# Check the deployment
kubectl rollout status deployment kubechaos

# Tip: you can watch the pods update in real-time
kubectl get pods -w
```

---

## 💡 Optional - Running Locally with Docker or Podman

Optionally, you can run the container with Docker/Podman directly, if you want to try the container outside of Kubernetes.

```bash
# Build the image
docker build -t kubechaos:v1 image

# Run the container
docker run -p 3000:3000 kubechaos:v1
```

Visit: **[http://localhost:3000](http://localhost:3000)**

> **Podman users:** Replace `docker` with `podman` in the above commands.

## 💡 Optional - Enable pod destruction!

You can change the ENABLE_POD_DESTROY environment variable to "true" to enable the pod destruction surprise!

```bash
kubectl patch deployment kubechaos -p '{"spec":{"template":{"spec":{"containers":[{"name":"app","env":[{"name":"ENABLE_POD_DESTROY","value":"true"}]}]}}}}'
```

The pods should restart automatically.

```bash
# Tip: you can watch the pods get replaced in real-time
kubectl get pods -w
```

Refresh the page until you see a red button with "DESTROY POD NOW". The pod is killed (which you will be
able to see with the above command) and replaced automatically.
