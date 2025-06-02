import { StoryClient } from '@story-protocol/core-sdk';
import { createPublicClient, createWalletClient, http } from 'viem';
import { aeneid, WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk';
import { PinataSDK } from 'pinata-web3';
import CryptoJS from 'crypto-js';

// Network configuration
const networkConfig = {
  rpcProviderUrl: 'https://aeneid.storyrpc.io',
  blockExplorer: 'https://aeneid.storyscan.io',
  protocolExplorer: 'https://aeneid.explorer.story.foundation',
  defaultSPGNFTContractAddress: '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc',
  chain: aeneid
};

// Royalty Policy addresses
export const RoyaltyPolicyLAP = '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E';
export const RoyaltyPolicyLRP = '0x9156e603C949481883B1d3355c6f1132D191fC41';

// Initialize Pinata client
const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT
});

// Initialize Story Protocol client
export const initializeStoryClient = (signer) => {
  if (!signer || !signer.account) {
    throw new Error('Signer with valid account is required to initialize Story client');
  }

  const config = {
    account: signer.account, // Pass the full account object instead of just the address
    transport: http(networkConfig.rpcProviderUrl),
    chainId: 'aeneid'
  };

  return StoryClient.newClient(config);
};

// Upload file to IPFS
export const uploadFileToIPFS = async (file) => {
  try {
    const { IpfsHash } = await pinata.upload.file(file);
    return `https://ipfs.io/ipfs/${IpfsHash}`;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
};

// Upload metadata to IPFS
export const uploadToIPFS = async (metadata) => {
  try {
    const { IpfsHash } = await pinata.upload.json(metadata);
    return {
      url: `https://ipfs.io/ipfs/${IpfsHash}`,
      hash: IpfsHash
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

// Calculate hash from file
export const calculateFileHash = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
        const hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
        resolve(`0x${hash}`);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Create commercial remix terms
export const createCommercialRemixTerms = (defaultMintingFee = 0, commercialRevShare = 5) => {
  return {
    transferable: true,
    royaltyPolicy: RoyaltyPolicyLAP,
    defaultMintingFee: BigInt(defaultMintingFee),
    expiration: BigInt(0),
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: '0x0000000000000000000000000000000000000000',
    commercializerCheckerData: '0x',
    commercialRevShare: commercialRevShare,
    commercialRevCeiling: BigInt(0),
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: BigInt(0),
    currency: WIP_TOKEN_ADDRESS,
    uri: 'https://github.com/piplabs/pil-document/blob/ad67bb632a310d2557f8abcccd428e4c9c798db1/off-chain-terms/CommercialRemix.json'
  };
};

// Register asset on Story Protocol
export const registerAssetOnStoryProtocol = async (client, assetData) => {
  const { title, description, image, imageHash, owner, category, condition, brand } = assetData;
  
  const ipMetadata = client.ipAsset.generateIpMetadata({
    title,
    description,
    createdAt: Math.floor(Date.now() / 1000).toString(),
    creators: [{
      name: brand || 'IntercambiARTE User',
      address: owner,
      contributionPercent: 100
    }],
    image,
    imageHash
  });

  const nftMetadata = {
    name: title,
    description,
    image,
    attributes: [
      {
        trait_type: "Category",
        value: category
      },
      {
        trait_type: "Condition",
        value: condition
      },
      {
        trait_type: "Brand",
        value: brand || "Unspecified"
      },
      {
        trait_type: "Status",
        value: "Available"
      },
      {
        trait_type: "Creator",
        value: owner
      }
    ]
  };

  const ipIpfsData = await uploadToIPFS(ipMetadata);
  const nftIpfsData = await uploadToIPFS(nftMetadata);
  
  // Calcular correctamente los hashes
  const ipMetadataHash = `0x${CryptoJS.SHA256(JSON.stringify(ipMetadata)).toString(CryptoJS.enc.Hex)}`;
  const nftMetadataHash = `0x${CryptoJS.SHA256(JSON.stringify(nftMetadata)).toString(CryptoJS.enc.Hex)}`;

  try {
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: networkConfig.defaultSPGNFTContractAddress,
      licenseTermsData: [{
        terms: createCommercialRemixTerms(0, 5)
      }],
      ipMetadata: {
        ipMetadataURI: ipIpfsData.url,
        ipMetadataHash: ipMetadataHash,
        nftMetadataURI: nftIpfsData.url,
        nftMetadataHash: nftMetadataHash
      },
      txOptions: { waitForTransaction: true },
      wipOptions: {
        enableAutoWrapIp: true,
        enableAutoApprove: true,
        useMulticallWhenPossible: true
      }
    });

    return {
      txHash: response.txHash,
      ipId: response.ipId,
      licenseTermsIds: response.licenseTermsIds,
      explorerUrl: `${networkConfig.protocolExplorer}/ipa/${response.ipId}`
    };
  } catch (error) {
    console.error('Error registering asset on Story Protocol:', error);
    throw error;
  }
};