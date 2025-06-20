# 🚀 ETH Node Management Dashboard

A modern and lightweight dashboard built with **React** for monitoring and managing Ethereum nodes. Designed for node operators, DevOps engineers, and blockchain infra teams to gain visibility into node status, network distribution, activity logs, and more.

---

## 🧩 Features

- 📊 **Total & Active Node Tracking**
- ✅ **Real-Time Node Health Status**
- ⚠️ **Recent Failures & Crash Insights**
- 🌐 **Network Distribution Breakdown**
- 🧾 **Audit Log with User Activities**
- 🛠️ **Support for Node Registration & Updates**
- 🎨 Built using a clean and responsive **React template** (customizable)

---

## ⚙️ Tech Stack

| Layer        | Technology           |
|--------------|----------------------|
| Frontend     | React + Tailwind CSS |
| Backend | Node.js + Fastify |
| Data Store | MongoDB |
| Auth | JWT |

## 🛜 Tested Deployed Network

| Network | Mainnet | Sepolia | Holesky | Hoodie | Goerli |
|--------------|---------|---------|---------|--------|--------|
| Geth     | ✅ | ✅ | ✅ | ❌ | ❌ |

---

## 📁 Project Structure

```bash
ethereum-node-auto-deployer/
├── _infra/
│   ├── ansible/  # Ansible working directory
├── _backend/     # Backend working directory
├── public/   
├── src/          # Frontend working directory 
├── tailwind.config.js
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── deploy-node.sh
├── makefile
├── server.js
├── .env
└── README.md
```

---

## 🛠️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/tukangk3tik/ethereum-node-auto-deployer.git
   cd ethereum-node-auto-deployer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the dev server**
   ```bash
   make fe-server
   make be-server
   ```

4. **Open in browser**
   ```bash
   http://localhost:5173
   ```

---

## 🚧 Future Plans

- [ ] Backend integration for live data
- [ ] Node sync status with Prometheus
- [ ] Alerting system (email/webhook)
- [ ] Role-based access control

---

## 🙌 Contributing

Contributions are welcome! Open a PR or create an issue to improve functionality, design, or documentation.

---

## 📄 License

MIT License © 2025 [Felix Serang](https://github.com/tukangk3tik)

---

## 📬 Contact

For questions or business inquiries: [yanfreddrick@gmail.com](mailto:yanfreddrick@gmail.com)
