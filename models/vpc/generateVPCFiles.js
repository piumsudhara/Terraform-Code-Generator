import fs from 'fs-extra';
import path from 'path';

export const generateMainTF = (vpcAnswers) => {
  const mainTFContent = `
provider "aws" {
region = "${vpcAnswers.regionCode}"
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.13.0"

  name                 = var.vpc_name
  cidr                 = var.cidr_block
  azs                  = var.azs
  public_subnets       = var.public_subnets
  private_subnets      = var.private_subnets
  enable_nat_gateway   = var.enable_nat_gateway
  enable_dns_hostnames = var.enable_dns_hostnames
  enable_dns_support   = var.enable_dns_support

  tags = {
    Name = var.vpc_name
  }
}
  `;

  fs.outputFileSync(path.join('output/vpc', 'main.tf'), mainTFContent);
  console.log('Generated: output/vpc/main.tf');
};

export const generateVariablesTF = (vpcAnswers) => {
  const variablesTFContent = `
variable "vpc_name" {
  description = "The name of the VPC"
  type        = string
  default     = "${vpcAnswers.vpc_name}"
}

variable "cidr_block" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "${vpcAnswers.cidr_block}"
}

variable "azs" {
  description = "List of availability zones"
  type        = list(string)
  default     = [${JSON.stringify(vpcAnswers.azs)}]
}

variable "public_subnets" {
  description = "List of public subnets"
  type        = list(string)
  default     = ["${vpcAnswers.public_subnets.split(',').join('","')}"]
}

variable "private_subnets" {
  description = "List of private subnets"
  type        = list(string)
  default     = [${vpcAnswers.private_subnets ? `"${vpcAnswers.private_subnets.split(',').join('","')}"` : '[]'}]
}

variable "enable_nat_gateway" {
  description = "Whether to enable NAT Gateway"
  type        = bool
  default     = ${vpcAnswers.enable_nat_gateway}
}

variable "enable_dns_hostnames" {
  description = "Whether to enable DNS hostnames"
  type        = bool
  default     = ${vpcAnswers.enable_dns_hostnames}
}

variable "enable_dns_support" {
  description = "Whether to enable DNS support"
  type        = bool
  default     = ${vpcAnswers.enable_dns_support}
}
  `;

  fs.outputFileSync(path.join('output/vpc', 'variables.tf'), variablesTFContent);
  console.log('Generated: output/vpc/variables.tf');
};

export const generateOutputsTF = (vpcAnswers) => {
  const outputsTFContent = `
output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnets" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnets
}

output "private_subnets" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnets
}
  `;

  fs.outputFileSync(path.join('output/vpc', 'outputs.tf'), outputsTFContent);
  console.log('Generated: output/vpc/outputs.tf');
};
