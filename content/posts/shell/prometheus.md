---
title: "使用RPM仓库安装Prometheus"
date: 2020-03-10T00:00:00+08:00
categories: ["shell"]
---

### 1. 安装prometheus/grafana/alertmanager
```sh
# rpm repo
# https://github.com/lest/prometheus-rpm
cat > /etc/yum.repos.d/prometheus.repo << EOF
[prometheus]
name=prometheus
baseurl=https://packagecloud.io/prometheus-rpm/release/el/\$releasever/\$basearch
repo_gpgcheck=1
enabled=1
gpgkey=https://packagecloud.io/prometheus-rpm/release/gpgkey
       https://raw.githubusercontent.com/lest/prometheus-rpm/master/RPM-GPG-KEY-prometheus-rpm
gpgcheck=1
metadata_expire=300
EOF
# update cache
dnf makecache
# grafana
dnf install grafana -y
systemctl start grafana
# prometheus
dnf install prometheus -y
# exporter
cat >> /etc/prometheus/prometheus.yml << EOF
  - job_name: "node_exporter"
    static_configs:
      - targets: ["localhost:9100"]
  - job_name: "mysqld_exporter"
    static_configs:
      - targets: ["localhost:9104"]
  - job_name: "process_exporter"
    static_configs:
      - targets: ["localhost:9256"]
EOF
systemctl start prometheus
# alert manager
dnf install alertmanager -y
systemctl start alertmanager
```

### 2. 安装node_exporter/mysqld_exporter/process_exporter
```sh
## node expoeter ##
dnf install node_exporter -y
# start
systemctl start node_exporter
## mysql exporter ##
dnf install mysqld_exporter -y
# mysql ini config
echo -n 'MYSQLD_EXPORTER_OPTS="--config.my-cnf=/etc/prometheus/mysqld_exporter.ini"' > /etc/default/mysqld_exporter
# mysql init config file
cat > /etc/prometheus/mysqld_exporter.ini << EOF
[client]
host=localhost
socket=/var/lib/mysql/mysql.sock
port=3306
user=root
password=root
EOF
# start
systemctl start mysqld_exporter
## process exporter ##
dnf install process_exporter -y
systemctl start process_exporter
```
