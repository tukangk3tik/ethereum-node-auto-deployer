# Nethermind Node Deployment Role

This Ansible role deploys a Nethermind Ethereum client using Docker. It supports various configurations for different network types and sync modes.

## Requirements

- Ansible 2.9+
- Docker
- Python 3.6+
- `community.docker` collection

## Role Variables

### Docker Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `nethermind_image` | `nethermind/nethermind` | Docker image for Nethermind |
| `nethermind_tag` | `latest` | Docker image tag |
| `nethermind_container_name` | `nethermind` | Name for the Docker container |

### Storage Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `nethermind_data_dir` | `/opt/nethermind-data` | Directory for Nethermind data |
| `nethermind_config_dir` | `/etc/nethermind` | Directory for Nethermind configuration |

### Network Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `nethermind_p2p_port` | `30303` | P2P port |
| `nethermind_http_port` | `8545` | HTTP JSON-RPC port |
| `nethermind_ws_port` | `8546` | WebSocket JSON-RPC port |
| `nethermind_enable_public_access` | `false` | Enable public RPC access |

### Sync Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `nethermind_sync_mode` | `"Fast"` | Sync mode (Fast, FastBlocks, Full, Beam, Snap, None) |
| `nethermind_fast_sync` | `true` | Enable fast sync |
| `nethermind_fast_blocks` | `true` | Enable fast blocks |
| `nethermind_download_bodies_in_fast_sync` | `true` | Download block bodies in fast sync |
| `nethermind_download_receipts_in_fast_sync` | `true` | Download receipts in fast sync |
| `nethermind_use_priority_peers` | `true` | Use priority peers |
| `nethermind_pivot_number` | `0` | Pivot block number (0 = auto) |

### JSON-RPC Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `nethermind_json_rpc_enabled` | `true` | Enable JSON-RPC |
| `nethermind_json_rpc_host` | `"0.0.0.0"` | JSON-RPC host |
| `nethermind_json_rpc_port` | `8545` | JSON-RPC port |
| `nethermind_ws_enabled` | `true` | Enable WebSocket |
| `nethermind_ws_host` | `"0.0.0.0"` | WebSocket host |
| `nethermind_ws_port` | `8546` | WebSocket port |
| `nethermind_engine_port` | `8551` | Engine API port |
| `nethermind_engine_host` | `"0.0.0.0"` | Engine API host |

### Wallet Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `nethermind_enable_unsecured_dev_wallet` | `false` | Enable unsecured dev wallet |
| `nethermind_enable_unsecured_dev_when_no_producer` | `false` | Enable unsecured dev wallet when no producer |

### Logging Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `nethermind_log_level` | `"Info"` | Log level (Trace, Debug, Info, Warn, Error, Off) |
| `nethermind_log_max_size` | `"100m"` | Maximum log file size |
| `nethermind_log_max_files` | `"3"` | Maximum number of log files to keep |

### Metrics Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `nethermind_metrics_enabled` | `false` | Enable metrics |
| `nethermind_metrics_host` | `"0.0.0.0"` | Metrics host |
| `nethermind_metrics_port` | `6060` | Metrics port |
| `nethermind_metrics_interval_seconds` | `5` | Metrics push interval in seconds |

## Example Playbook

```yaml
- hosts: ethereum_nodes
  become: true
  roles:
    - role: deploy_nethermind_node
      vars:
        nethermind_tag: "1.17.0"
        nethermind_enable_public_access: true
        nethermind_http_modules:
          - "Eth"
          - "Net"
          - "Web3"
          - "Debug"
          - "Trace"
        nethermind_ws_modules:
          - "Eth"
          - "Net"
          - "Web3"
```

## License

MIT-0

## Author Information

This role was created by [Your Name] for deploying Nethermind Ethereum clients.
