You may already be familiar with containerised workflows using Docker, perhaps
using Docker or Podman Compose to run multi-container applications on a single
host. Kubernetes goes beyond these tools as a container orchestration *platform* for
managing applications that may be complex and supported by multiple hosts (a
cluster).

This workshop covers Kubernetes' key features so that you can judge whether it's
right for your application deployments. 
 
Here are a few of the headline features, compared with Docker Compose:

- **Availability** – Kubernetes spreads containers across nodes; Compose runs on a single host
- **Horizontal scaling** – Kubernetes adjusts application replica counts with no downtime; Compose scaling is more manual
- **Self-healing** – Kubernetes automatically restarts and reschedules failed containers; Compose offers basic restart policies
- **Rolling updates** – Kubernetes supports zero-downtime rolling updates for complex setups; Compose requires interrupting services
- **Resource management** – Kubernetes gives fine-grained control over CPU/memory across a cluster; Compose can set basic per-container limits
- **Networking** – Kubernetes offers advanced networking (services, ingress) than Compose
- **Security** – Kubernetes has Role Based Accessed Control and network policies; Compose relies on host security and container isolation
- **Extensibility** – Kubernetes has a large ecosystem (CRDs, third-party tools) and package manager (Helm); Compose is a fixed spec with no plugin model
- **Stateful applications** – Kubernetes' `StatefulSets` give persistent identity and storage; Compose relies on plain volume/bind mounts
- **Backup and restore** – Kubernetes `PersistentVolumes` and `ConfigMaps` provide intuitive storage or data and parameters; Compose needs manual volume handling

In summary, Docker Compose suits small, single-host projects. Kubernetes suits production environments needing scale, resilience, and advanced management.

