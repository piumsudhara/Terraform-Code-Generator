import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateCidr, validateSubnets } from '../validations/validations.js';
import { regionMappings, availabilityZones } from '../validations/regionazMappings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export { inquirer, fs, path, __dirname, validateCidr, validateSubnets, regionMappings, availabilityZones};
