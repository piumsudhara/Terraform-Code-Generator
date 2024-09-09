import inquirer from 'inquirer';
import { promptVPC, generateVPCFiles } from './models/vpc/vpc.js';
import { promptEC2, generateEC2File } from './models/ec2/ec2.js';
import { promptSecurityGroup, generateSecurityGroupFiles } from './models/sg/sg.js';

const main = async () => {

  console.log('╔═════════════════════════════════════════╗');
  console.log('║           Terraform Code Generator      ║');
  console.log('╚═════════════════════════════════════════╝');
  console.log('');

  try {
    const { selectedModules } = await promptUser();
    
    let vpcName;
    
    if (selectedModules.includes('VPC')) {
      const vpcAnswers = await promptVPC();
      vpcName = vpcAnswers.vpc_name;
      generateVPCFiles(vpcAnswers);
    }

    if (selectedModules.includes('Security Group')) {
      if (!vpcName) {
        console.error('Error: VPC must be created before Security Group');
        return;
      }
      const securityGroupAnswers = await promptSecurityGroup(vpcName);
      generateSecurityGroupFiles(securityGroupAnswers);
    }

    if (selectedModules.includes('EC2')) {
      const ec2Answers = await promptEC2();
      generateEC2File(ec2Answers);
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

const promptUser = async () => {
  const { selectedModules } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedModules',
      message: 'Select the modules to create:',
      choices: ['VPC', 'EC2', 'Security Group'],
    },
  ]);

  const answers = {};
  return { selectedModules };
};

main();
