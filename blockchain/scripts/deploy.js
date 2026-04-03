const hre = require("hardhat");

/**
 * CommonJS Deployment script to initialize the CertificateStore on a network.
 */
async function main() {
  console.log("------------------------------------------");
  console.log("DEPLOYING CertificateStore...");

  // 1. Get the contract factory
  const CertificateStore = await hre.ethers.getContractFactory("CertificateStore");

  // 2. Deploy the contract
  const certificateStore = await CertificateStore.deploy();

  // 3. Wait for deployment successful
  await certificateStore.waitForDeployment();

  // 4. Get the deployed address
  const address = await certificateStore.getAddress();

  console.log("------------------------------------------");
  console.log("SUCCESS: CertificateStore Deployed!");
  console.log("CONTRACT ADDRESS: ", address);
  console.log("------------------------------------------");
  console.log("\n⚠️  ACTION REQUIRED: Copy the CONTRACT ADDRESS above and update your 'backend/.env'!");
  console.log("------------------------------------------");
}

/* Run the script */
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
