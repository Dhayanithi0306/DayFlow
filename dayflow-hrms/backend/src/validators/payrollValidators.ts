export interface UpdateSalaryStructureInput {
  basicSalary: number;
  hra?: number;
  standardAllowance?: number;
  performanceBonus?: number;
  leaveTravelAllowance?: number;
  fixedAllowance?: number;
  providentFund?: number;
  professionalTax?: number;
  currency?: string;
  effectiveFrom: string;
}

export interface GeneratePayrollInput {
  payPeriodStart: string;
  payPeriodEnd: string;
}

export const validateUpdateSalaryStructure = (input: UpdateSalaryStructureInput) => {
  if (input.basicSalary === undefined || input.basicSalary < 0) {
    return { isValid: false, message: 'Basic salary must be a non-negative number.' };
  }
  if (input.hra !== undefined && input.hra < 0) {
    return { isValid: false, message: 'HRA cannot be negative.' };
  }
  if (input.standardAllowance !== undefined && input.standardAllowance < 0) {
    return { isValid: false, message: 'Standard allowance cannot be negative.' };
  }
  if (input.performanceBonus !== undefined && input.performanceBonus < 0) {
    return { isValid: false, message: 'Performance bonus cannot be negative.' };
  }
  if (input.leaveTravelAllowance !== undefined && input.leaveTravelAllowance < 0) {
    return { isValid: false, message: 'LTA cannot be negative.' };
  }
  if (input.fixedAllowance !== undefined && input.fixedAllowance < 0) {
    return { isValid: false, message: 'Fixed allowance cannot be negative.' };
  }
  if (input.providentFund !== undefined && input.providentFund < 0) {
    return { isValid: false, message: 'Provident fund cannot be negative.' };
  }
  if (input.professionalTax !== undefined && input.professionalTax < 0) {
    return { isValid: false, message: 'Professional tax cannot be negative.' };
  }
  if (!input.effectiveFrom || isNaN(Date.parse(input.effectiveFrom))) {
    return { isValid: false, message: 'Valid effective date is required.' };
  }

  return { isValid: true };
};

export const validateGeneratePayroll = (input: GeneratePayrollInput) => {
  if (!input.payPeriodStart || isNaN(Date.parse(input.payPeriodStart))) {
    return { isValid: false, message: 'Valid pay period start date is required.' };
  }
  if (!input.payPeriodEnd || isNaN(Date.parse(input.payPeriodEnd))) {
    return { isValid: false, message: 'Valid pay period end date is required.' };
  }

  const start = new Date(input.payPeriodStart);
  const end = new Date(input.payPeriodEnd);

  if (end.getTime() <= start.getTime()) {
    return { isValid: false, message: 'Pay period end date must be after start date.' };
  }

  return { isValid: true };
};
