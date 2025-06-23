import network_list from "./data/network_list.json" assert { type: 'json' };
import client_type from "./data/client_type.json" assert { type: 'json' };
import EthNetworkList from "./models/eth-network-list.js";
import EthClientType from "./models/eth-client-type.js";
import seedUser from "./data/seed-user.js";

async function seeder() {
  try {
    // seed network list
    network_list.forEach(async (network) => {
      await EthNetworkList.findOneAndUpdate({ key: network.id }, {
        $setOnInsert: { 
          key: network.id,
          name: network.name,
          created_at: new Date(),
        },
      }, { upsert: true, new: true });
    });

    // seed client type
    client_type.forEach(async (client) => {
      await EthClientType.findOneAndUpdate({ key: client.id }, {
        $setOnInsert: { 
          key: client.id,
          name: client.name,
          created_at: new Date(),
        },
      }, { upsert: true, new: true });
    });

    // seed user
    await seedUser();

    console.log("✅ Seeded successfully!");
  } catch (error) {
    console.error('❌ Setup project error:', error);
    process.exit(1); // Exit process on failure
  }
}

export default seeder;