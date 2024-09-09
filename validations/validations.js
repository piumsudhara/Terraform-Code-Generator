export const validateCidr = (input) => {
  const cidrRegex = /^(?!.*\.\.)(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}\/([0-9]|[1-2][0-9]|3[0-2])$/;
  if (cidrRegex.test(input)) {
    return true;
  }
  return 'Please enter a valid CIDR block (e.g., 10.0.0.0/16).';
};

export const validateSubnets = (input) => {
  const trimmedInput = input.trim();

  if (trimmedInput === 'null') {
    return true;
  }

  const subnetArray = trimmedInput.split(',').map(subnet => subnet.trim());

  for (const subnet of subnetArray) {
    const validationResult = validateCidr(subnet);
    if (validationResult !== true) {
      return `Invalid subnet "${subnet}". ${validationResult}`;
    }
  }

  return true;
};
