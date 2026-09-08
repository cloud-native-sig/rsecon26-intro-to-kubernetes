# Minikube Issues on Ubuntu / Linux

Minikube has several virtualisation drivers it can use to run the underlying containers. On Ubuntu these include Docker, Podman, QEMU, Virtualbox and KVM2. 
There is a complete list and descriptions available from [the Minikube driver docs](https://minikube.sigs.k8s.io/docs/drivers/).
Some of these drivers can cause some problems for some users.

Note that if you switch driver after you have created a Minikube cluster (or an attempt at one) then you will have to delete the old one first with `minikube delete`.
This also deletes any images you had built. Switching drivers can take several minutes and involve several hundred megabytes of downloads as differe Minikube components are downlaoded.

## KVM2 not supported

The KVM2 driver requires CPU virtualisation support (specifically VMX or SVM extensions) that many laptops/older systems don't have. You can check if this will work by running:

`grep -E -q 'vmx|svm' /proc/cpuinfo && echo yes || echo no`

## Qemu does not support minikube service

The initial deployment of the image works and the pod starts up, but running `minikube service kubechaos-svc` produces the error:

```
Exiting due to MK_UNIMPLEMENTED: minikube service is not currently implemented with the builtin network on QEMU
```

You can work around this by port forwarding port 3000 with `kubectl port-forward`, e.g. (change the pod name to match your kubechaos pod)

```
kubectl port-forward kubechaos-7d77bbc4b7-2jxnf 3000:3000
```

## Podman too old on Ubuntu 22.04

Ubuntu's official version of Podman often lags far behind the latest version, the Podman driver requires version 4.9 or newer. Ubuntu 22.04 supplies 4.6.2. Ubuntu 24.04 supplies 4.9.3 and 26.04 supplies Podman 5.7.0.
Ubuntu 22.04 users should use a different method such as Rootless Docker.

## Enable rootless mode for Podman/Rootless Docker

### Set Minikube to Rootless mode 

To use either Podman or Rootless Docker, Minikube needs to be set to rootless mode.

```
minikube config set rootless true
```

### Enable CPU, CPUSET and I/O delegation

Rootless Docker (and possibly Podman) need to enable CPU, CPUSET and I/O delegation in Cgroups.

You can verify the current status of this by running:

```
cat /sys/fs/cgroup/user.slice/user-$(id -u).slice/user@$(id -u).service/cgroup.controllers
```

This should returns `cpu cpuset io memory pids`, if it just contains `memory pids` then enable it by running:

```
sudo mkdir -p /etc/systemd/system/user@.service.d
cat <<EOF | sudo tee /etc/systemd/system/user@.service.d/delegate.conf
[Service]
Delegate=cpu cpuset io memory pids
EOF
sudo systemctl daemon-reload
```

Source: [https://rootlesscontaine.rs/getting-started/common/cgroup2/#enabling-cpu-cpuset-and-io-delegation](https://rootlesscontaine.rs/getting-started/common/cgroup2/#enabling-cpu-cpuset-and-io-delegation) (linked from Minikube/Podman error message).


## Rootless Docker

Install Rootless Docker:

```
sudo apt install docker-ce docker-ce-rootless-extras
```

Set Minikube to use Docker driver:

```
minikube start --driver=docker
```

