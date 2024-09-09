import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptEC2 = async () => {
  const ec2Answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'instance_type',
      message: 'Enter EC2 instance type:',
      default: 't2.micro',
    },
    {
      type: 'input',
      name: 'ami_id',
      message: 'Enter AMI ID for EC2 instance:',
      default: 'ami-0c55b159cbfafe1f0',
    },
    {
      type: 'input',
      name: 'key_name',
      message: 'Enter key pair name for SSH:',
      default: 'default-key-pair',
    },
  ]);

  return ec2Answers;
};

const generateEC2File = (ec2Answers) => {
  const ec2Template = fs.readFileSync(path.join(__dirname, 'ec2_template.tpl'), 'utf8');
  
  const ec2Content = ec2Template
    .replace(/{{instance_type}}/g, ec2Answers.instance_type)
    .replace(/{{ami_id}}/g, ec2Answers.ami_id)
    .replace(/{{key_name}}/g, ec2Answers.key_name);

  fs.outputFileSync('build/ec2_main.tf', ec2Content);
  console.log('Generated: build/ec2_main.tf');
};

export { promptEC2, generateEC2File };
