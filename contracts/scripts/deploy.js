const hre = require("hardhat");

async function main() {
    console.log("Deploying SPVPropertyToken...");

    const baseURI = "https://api.domira.io/metadata/";

    const SPVPropertyToken = await hre.ethers.getContractFactory("SPVPropertyToken");
    const token = await SPVPropertyToken.deploy(baseURI);

    await token.waitForDeployment();

    const address = await token.getAddress();
    console.log(`SPVPropertyToken deployed to: ${address}`);

    // Verify on Etherscan if not on localhost
    if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
        console.log("Waiting for block confirmations...");
        await token.deploymentTransaction().wait(5);

        console.log("Verifying contract on Etherscan...");
        try {
            await hre.run("verify:verify", {
                address: address,
                constructorArguments: [baseURI],
            });
            console.log("Contract verified successfully!");
        } catch (error) {
            console.error("Verification failed:", error.message);
        }
    }

    return address;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
