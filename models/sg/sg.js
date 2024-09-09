import { inquirer, validateCidr } from '../../lib/common.js';
import { generateMainTF, generateVariablesTF, generateOutputsTF } from './generateSecurityGroupFiles.js';

// Function to prompt user for security group details
const promptSecurityGroup = async (vpcName) => {
  const securityGroupAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'sg_name',
      message: 'Enter Security Group name:',
      default: 'default-sg-name',
    },
    {
      type: 'input',
      name: 'ingress_cidr_blocks',
      message: 'Enter allowed ingress CIDR blocks (e.g., 0.0.0.0/0):',
      validate: validateCidr,
      default: '0.0.0.0/0',
    },
    {
      type: 'input',
      name: 'ingress_ports',
      message: 'Enter ingress ports (comma-separated, e.g., 80,443):',
      validate: (input) => {
        if (!input.trim()) return 'Please provide at least one port.';
        return true;
      },
      default: '80,443',
    },
    {
      type: 'input',
      name: 'egress_cidr_blocks',
      message: 'Enter allowed egress CIDR blocks (e.g., 0.0.0.0/0):',
      validate: validateCidr,
      default: '0.0.0.0/0',
    },
    {
      type: 'input',
      name: 'egress_ports',
      message: 'Enter egress ports (comma-separated, e.g., 0-65535):',
      validate: (input) => {
        if (!input.trim()) return 'Please provide at least one port.';
        return true;
      },
      default: '0-65535',
    },
  ]);

  // Include the VPC name in the answers to pass to the Terraform files
  securityGroupAnswers.vpc_name = vpcName;

  return securityGroupAnswers;
};

// Function to generate Terraform files for the Security Group
const generateSecurityGroupFiles = (securityGroupAnswers) => {
  generateMainTF(securityGroupAnswers);
  generateVariablesTF(securityGroupAnswers);
  generateOutputsTF(securityGroupAnswers);
};

export { promptSecurityGroup, generateSecurityGroupFiles };
