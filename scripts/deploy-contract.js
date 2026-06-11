const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  if (!process.env.DEPLOYER_PRIVATE_KEY) {
    console.error('\nMissing DEPLOYER_PRIVATE_KEY in .env.local');
    console.error('Export your MetaMask Sepolia account private key temporarily for deployment.');
    console.error('Never commit this key or push .env.local to GitHub.\n');
    process.exit(1);
  }

  console.log('Deploying DoctorAppointmentPayment to Sepolia...\n');

  const DoctorAppointmentPayment = await hre.ethers.getContractFactory(
    'DoctorAppointmentPayment'
  );
  const contract = await DoctorAppointmentPayment.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const network = await hre.ethers.provider.getNetwork();

  console.log('Deployed successfully!');
  console.log(`Network: ${network.name} (chainId ${network.chainId})`);
  console.log(`Contract address: ${address}`);
  console.log(`Sepolia explorer: https://sepolia.etherscan.io/address/${address}\n`);

  console.log('Add this to .env.local AND Vercel Environment Variables:');
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`);

  const envLocalPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    let envContent = fs.readFileSync(envLocalPath, 'utf8');
    if (/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/.test(envContent)) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`;
    }
    fs.writeFileSync(envLocalPath, envContent);
    console.log('Updated .env.local with the new contract address.');
  }

  console.log('\nRestart your dev server: pnpm dev');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
