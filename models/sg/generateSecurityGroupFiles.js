import fs from 'fs-extra';
import path from 'path';

export const generateMainTF = (securityGroupAnswers) => {
  const mainTFContent = `
resource "aws_security_group" "${securityGroupAnswers.sg_name}" {
  name        = var.sg_name
  vpc_id      = module.${securityGroupAnswers.vpc_name}.vpc_id  # Referencing VPC module

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.ingress_cidr_blocks
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.ingress_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = var.egress_cidr_blocks
  }

  tags = {
    Name = var.sg_name
  }
}
  `;

  fs.outputFileSync(path.join('build/security-group', 'main.tf'), mainTFContent);
  console.log('Generated: build/security-group/main.tf');
};

export const generateVariablesTF = (securityGroupAnswers) => {
  const variablesTFContent = `
variable "sg_name" {
  description = "The name of the Security Group"
  type        = string
  default     = "${securityGroupAnswers.sg_name}"
}

variable "ingress_cidr_blocks" {
  description = "CIDR blocks for ingress"
  type        = list(string)
  default     = "${securityGroupAnswers.ingress_cidr_blocks.split(',').join('","')}"
}

variable "egress_cidr_blocks" {
  description = "CIDR blocks for egress"
  type        = list(string)
  default     = "${securityGroupAnswers.egress_cidr_blocks.split(',').join('","')}"
}
  `;

  fs.outputFileSync(path.join('build/security-group', 'variables.tf'), variablesTFContent);
  console.log('Generated: build/security-group/variables.tf');
};

export const generateOutputsTF = (securityGroupAnswers) => {
  const outputsTFContent = `
output "sg_id" {
  description = "The ID of the Security Group"
  value       = aws_security_group.${securityGroupAnswers.sg_name}.id
}
  `;

  fs.outputFileSync(path.join('build/security-group', 'outputs.tf'), outputsTFContent);
  console.log('Generated: build/security-group/outputs.tf');
};
