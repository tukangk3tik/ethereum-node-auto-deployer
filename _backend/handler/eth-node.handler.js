
export const createEthNode = async (_req, reply) => {
  try {
    const { node_id, type, network, ip, port, status, deploy_at, created_by } = _req.body;

    // execute ansible here
    
    const newEthNode = new EthNode({
      node_id,
      type,
      network,
      ip,
      port,
      status,
      deploy_at,
      created_by,
    });
    // await newEthNode.save();

    reply.code(201).send({ data: newEthNode });
  } catch (error) {
    reply.code(500).send(error);
  }
}
  
export const getEthNode = async (_req, reply) => {
  try {
    // const ethNode = await EthNode.find();
    const ethNode = [
      {
        _id: "1",
        node_id: "NODE1",
        type: "Geth",
        network: "Mainnet",
        is_testnet: false,
        ip_address: "192.168.1.1",
        port: "30303",
        rpc_port: ":8545",
        status: true,
        is_deploying: false,
        deploy_at: new Date(),
        uptime: "3h 21m",
        created_by: "user1",
      },
      {
        _id: "2",
        node_id: "NODE2",
        type: "Geth",
        network: "Goerli",
        is_testnet: true,
        ip_address: "192.168.1.2",
        port: "30303",
        rpc_port: ":8545",
        status: false,
        is_deploying: true,
        deploy_at: new Date(),
        uptime: "-",
        created_by: "user1",
      },
      {
        _id: "3",
        node_id: "NODE3",
        type: "Nethermind",
        network: "Sepolia",
        is_testnet: true,
        ip_address: "192.168.1.3",
        port: "30303",
        rpc_port: ":8545",
        status: false,
        is_deploying: false,
        deploy_at: new Date(),
        uptime: "-",
        created_by: "user1",
      },
    ];

    const metaData = {
      current_page: 1,
      per_page: 10,
      total_items: ethNode.length
    };

    reply.code(200).send({ data: ethNode, meta_data: metaData });
  } catch (error) {
    reply.code(500).send(error);
  }
}
  