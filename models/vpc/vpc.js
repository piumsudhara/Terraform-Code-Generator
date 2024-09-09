import { inquirer, validateCidr, validateSubnets, regionMappings, availabilityZones } from '../../lib/common.js';
import { generateMainTF, generateVariablesTF, generateOutputsTF } from './generateVPCFiles.js';

const defaultPrivateSubnets = '10.0.3.0/24';

const promptVPC = async () => {
  const { region } = await inquirer.prompt([
    {
      type: 'input',
      name: 'region',
      message: 'Enter region (e.g., Singapore):',
      default: 'Singapore',
      validate: (input) => {
        const regionCode = regionMappings[input.trim()];
        if (!regionCode) return 'Invalid region. Please provide a valid AWS region.';
        return true;
      },
    }
  ]);

  const regionCode = regionMappings[region.trim()];
  const availableAzs = availabilityZones[regionCode] || [];

  const vpcAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'azs',
      message: `Select availability zones for ${region} ("${availableAzs.join(', ')}"):`,
      validate: (input) => {
        const inputAzs = input.split(',').map(az => az.trim());
        const validAzs = availabilityZones[regionCode] || [];
        const invalidAzs = inputAzs.filter(az => !validAzs.includes(az));
        if (invalidAzs.length > 0) {
          return `Invalid AZs for ${region}. Valid AZs are: ${validAzs.join(', ')}.`;
        }
        return true;
      },
      default: availableAzs.join(', '),
    },
    {
      type: 'input',
      name: 'vpc_name',
      message: 'Enter VPC name:',
      default: 'default-vpc',
    },
    {
      type: 'input',
      name: 'cidr_block',
      message: 'Enter CIDR block for VPC (e.g., 10.0.0.0/16):',
      validate: validateCidr,
      default: '10.0.0.0/16',
    },
    {
      type: 'input',
      name: 'public_subnets',
      message: 'Enter public subnets (e.g., 10.0.2.0/24) (Enter "null" if not needed):',
      validate: validateSubnets,
      default: '10.0.2.0/24',
    },
    {
      type: 'input',
      name: 'private_subnets',
      message: 'Enter private subnets (e.g., 10.0.3.0/24) (Enter "null" if not needed):',
      validate: validateSubnets,
      filter: (input) => {
        const trimmedInput = input.trim();
        return trimmedInput === 'null' ? null : trimmedInput;
      },
      default: defaultPrivateSubnets,
    },
    {
      type: 'confirm',
      name: 'enable_nat_gateway',
      message: 'Do you want to enable NAT gateway?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'enable_dns_hostnames',
      message: 'Enable DNS Hostnames?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'enable_dns_support',
      message: 'Enable DNS Support?',
      default: true,
    }
  ]);

  return {
    region: region.trim(),
    regionCode,
    azs: vpcAnswers.azs.split(',').map(az => az.trim()),
    ...vpcAnswers,
  };
};

const generateVPCFiles = (vpcAnswers) => {
  generateMainTF(vpcAnswers);
  generateVariablesTF(vpcAnswers);
  generateOutputsTF(vpcAnswers);
};

export { promptVPC, generateVPCFiles };
