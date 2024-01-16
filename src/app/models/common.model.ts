export interface ApiResponseModel<T> {
  success: boolean;
  message: string;
  errors: string[];
  data: T;
};

export interface ApiGridResponseModel<T> {
  status: boolean;
  message: string;
  data: T;
  count: number;
};

export interface MenuItem {
  label: string;
  icon: string;
  rights: string;
  menuUrl: string;
};

export interface LoginModel {
  name: string;
  email: string;
  loginBy: string;
  firstName: string;
  lastName: string;
};

export interface LoginDataModel {
  email: string;
  password: string;
};

export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roleId: string;
  roleName: string;
  loginBy: string;
  customerId: number[];
  phoneNumber: string;
};

export class UserLogin {
  id?: string;
  email?: string;
  password?: string;
  token?: string;
}

export interface DDLCommonModel {
  id: number;
  text: string;
  selected: boolean;
};

export interface DataExtractionModel {
  documentTypeId: number;
  portfolioFileId: number;
  createdBy: number;
  DataExtractionFields: DataExtractionFieldModel[]
};

export interface DocumentTypeModel {
  id: number;
  text: string;
};

export interface DataExtractionFieldModel {
  dataExtractionFieldId: number;
  documentTypeId: number;
  fieldName: string;
  fieldValue: string;
  encompassValue: string;
  fieldIsRequired: string;
  acceptedFormatDetails: string;
  acceptedFormatRegex: string;
  status: string;
  nodeTitle: string;
  nodeSubTitle: string;
  dataExtractionValueGroupId: number;
  dataExtractionValueId: number;
  isDeletable: boolean;
  topLeftX: string;
  topLeftY: string;
  bottomRightX: string;
  bottomRightY: string;
  pageNo: string;
  pageWidth: string;
  portfolioOtherFileId: number
};

export interface ConditionCategoryModel {
  no: number;
  id: number;
  conditionCategoryCode: string;
  condition: string;
  status: string;
  // createdBy: number;
  // modifiedBy: number;
  // createdDate: Date;
  // strCreatedDate: string;
  // ModifiedDate: Date;
  // strModifiedDate: string;
};

export interface AuditModel {
  userName: string;
  strTime: string;
  action: string;
};

export interface ConditionDetailsModel {
  no: number;
  id: number;
  conditionDetailsCode: string;
  conditions: string;
  conditionCategoryCode: string;
  categoryCondition: string;
  status: string;
  conditionCategoryId: number;
  conditionDetailsKeyList: any[]
};

export interface PortfolioConditionModel {
  id: number;
  portfolioConditionId: number;
  portfolioFileId: number;
  conditionCategoryCode: string;
  conditionDetailsCode: string;
  comments: string;
  status: string;
  createdBy: number;
  strCreatedDate: string;
  conditionCategoryName: string;
  conditionDetailsName: string;
};

export interface PortfolioFilesModel {
  no: number;
  id: number;
  userName: string;
  portfolioName: string;
  fileName: string;
  filePath: string;
  status: string;
  //createdBy: number;
  //modifiedBy: number;
  dateCreated: Date;
  strDateCreated: string;
  lastModifiedDate: Date;
  strLastModifiedDate: string;
  startTime: Date;
  completedTime: Date;
  elapsedTime: number;
};



export interface AuthResponseModel {
  id: string;
  userName: string;
  email: string;
  token: string;
  role: string;
  loginBy: string
}

export interface UpdateStatusModel {
  status: string
}



export interface UserViewModel {
  no: number,
  id: string;
  lastName: string;
  email: string;
  loginBy: string;
  userType: string;
  customerId: number;
  customerName: string;
  status: string;
  createdDate: Date;
  strCreatedDate: string;
};

export interface Status {
  id: string;
  text: string;
}

export interface ErrorLogViewModel {
  no: number,
  id: number;
  userCreate: string;
  errorMessage: string;
  errorFullText: string;
  projectName: string;
  errorLocation: string;
  methodName: number;
  createdDate: Date;
  strCreatedDate: string;
};

export interface CustomerViewModel {
  no: number,
  id: number;
  customerName: string;
  loanNumber: string;
  noOfPages: number;
  inputPath: string;
  outputPath: string;
  //dateCreated: Date;
  //strDateCreated: string;
  lastModifiedDate: Date;
  strLastModifiedDate: string;
};

export interface CustomerModel {
  id: number;
  customerName: string;
  inputPath: string;
  outputPath: string;
  ftpType: string;
  sftpHost: string;
  sftpPort: string;
  sftpLoginId: string;
  sftpLoginPassword: string;
  ftpHost: string;
  ftpPort: string;
  ftpLoginId: string;
  ftpLoginPassword: string;
  s3BucketName: string;
  s3BucketKey: string;
  s3BucketRegion: string;
  azureStorageAccountName: string;
  azureStorageKey: string;
  azureStorageConnectionString: string;
  remoteDirectory: string;
  archiveDirectory: string;
  mainFileDirectory: string;
  mainFileName: string;
};

export interface RoleViewModel {
  id: string;
  name: string;
};

export interface RuleEngineViewModel {
  no: number,
  id: number;
  ruleName: string;
  customerId: string;
  customerName: string;
  value: string;
  documentTypeId: string;
  documentType: string;
  abbreviationId: string;
  abbreviation: string;
  Validation: string;
  strLastModifiedDate: string;
};

export interface RuleEngineModel {
  id: number;
  ruleName: string;
  customerId: string;
  customerName: string;
  value: string;
  abbreviationId: string;
  abbreviation: string;
  Validation: string;
};

export interface DownloadSFTPFilesRequestModel {
  id: number;
  FileSource: string;
};

export interface IncomeCalculationModel {
  borrowerName: string;
  employer: string;
  loanNumber: string;
  date: string;
  perHour: string;
  noofHoursHourly: string;
  monthlyIncomeHourly: string;
  ytdEarningsHourly: string;
  noofMonthsYTDHourly: string;
  ytdEarningsIncomeHourly: string;
  w2forTaxYearCurrentHourly: string;
  w2forCurrentTaxYearHourly: string;
  noofMonthsW2TaxCurrentYearHourly: string;
  monthlyIncomeW2TaxCurrentYearHourly: string;
  w2forTaxYearPrevHourly: string;
  w2forPrevTaxYearHourly: string;
  noofMonthsW2TaxYearPrevHourly: string;
  monthlyIncomeW2TaxYearPrevHourly: string;
  perHourRateHourly: string;
  ytdAvgHourly: string;
  ytd1W2AvgHourly: string;
  ytd2W2AvgHourly: string;
  uselowestincomeHourly: string;
  orchecktheincomeyouwishtouseHourly: string;
  monthlySalary: string;
  monthlyIncomeSalary: string;
  biWeeklySalary: string;
  biWeeklyIncomeSalary: string;
  semiMonthlySalary: string;
  semiMonthlyIncomeSalary: string;
  weeklySalary: string;
  weeklyIncomeSalary: string;
  paystubYTDSalary: string;
  noofMonthsYTDSalary: string;
  monthlyAvgSalary: string;
  w2IncomeOneSalary: string;
  noofMonthsOneSalary: string;
  incomeOneSalary: string;
  w2IncomeTwoSalary: string;
  noofMonthsTwoSalary: string;
  incomeTwoSalary: string;
  baseUsedtoQualifySalary: string;
  ytdOvertime: string;
  noofMonthsYTDOvertime: string;
  monthlyIncomeYTDOvertime: string;
  pastyearOTbreakoutOvertime: string;
  pastyearOTbreakoutNoofMonthsOvertime: string;
  pastyearOTbreakoutIncomeOvertime: string;
  additionalyearOTBonusOvertime: string;
  additionalyearOTBonusNoofMonthsOvertime: string;
  additionalyearOTBonusIncomeOvertime: string;
  ytdAvgOvertime: string;
  ytd1YearAvgOvertime: string;
  ytd2YearAvgOvertime: string;
  uselowerofcalculationsOvertime: string;
  orchecktheincomeyouwishtouseOvertime: string;
  ytdCommission: string;
  expensesCommission: string;
  pastYearCommission: string;
  expensesOneCommission: string;
  additionalYearCommission: string;
  expensesCommissionTwo: string;
  netIncomeCommission: string;
  noofMonthsOneCommission: string;
  monthlyIncomeOneCommission: string;
  netIncomeTwoCommission: string;
  noofMonthsTwoCommission: string;
  monthlyIncomeTwoCommission: string;
  netIncomeThreeCommission: string;
  noofMonthsThreeCommission: string;
  monthlyIncomeCommissionThree: string;
  ytdAvgNetIncomeCommission: string;
  ytd1YearAvgNetIncomeCommission: string;
  commissionExpense: string;
  ytd2YearAvgNetIncomeCommission: string;
  expenses2106: string;
  expensesFactorCommission: string;
  lowerofCalculationCommission: string;
  orchecktheincomeyouwishtouseCommission: string;
  typeofIncome: string;
  ytdOtherIncome: string;
  noofMonthsOtherIncome: string;
  ytdIncomeOtherIncome: string;
  w2forCurrentYearOtherIncome: string;
  currentYearOtherIncome: string;
  noofMonthsW2CurrentYearOtherIncome: string;
  monthlyIncomeW2CurrentYearOtherIncome: string;
  w2forPrevYearOtherIncome: string;
  prevYearOtherIncome: string;
  noofMonthsW2PrevYearOtherIncome: string;
  monthlyIncomeW2PrevYearOtherIncome: string;
  ytdOneOtherIncome: string;
  ytd1YearAvgOtherIncome: string;
  ytd2YearAvgOtherIncome: string;
  uselowestincomeavgOtherIncome: string;
  orchecktheincomeyouwishtouseOtherIncome: string;
  typeofIncomeNonTaxable: string;
  monthlycheckorDirectDeposit: string;
  monthlyDDIncomeNonTaxable: string;
  incomeFrom1099NonTaxable: string;
  monthlyIncomeFrom1099NonTaxable: string;
  annualAmountofIncome: string;
  additionalNonTaxableIncome: string;
  totalNonTaxableIncome: string;
  currentYearExpenseDeduction: string;
  yearExpenseDeduction: string;
  deduction12MonthAverage: string;
  prevYearExpenseDeduction: string;
  enterPrevYearExpenseDeduction: string;
  deduction24MonthAverage: string;
  totalIncometoQualify: string;
  underwriterComments: string;
  IsPerHourRate: boolean;
  IsYTDAvg: boolean;
  IsYTD1W2Avg: boolean;
  IsYTD2W2Avg: boolean;
  IsMonthlySalary: boolean;
  IsBiWeeklySalary: boolean;
  IsSemiMonthlySalary: boolean;
  IsWeeklySalary: boolean;
  IsYTDSalaryPaystub: boolean;
  IsW2IncomeOne: boolean;
  IsW2IncomeTwo: boolean;
  IsYTDAvgOvertime: boolean;
  IsYTD1YearAvgOvertime: boolean;
  IsYTD2YearAvgOvertime: boolean;
  IsYTDAvgNetIncomeCommission: boolean;
  IsYTD1YearAvgNetIncomeCommission: boolean;
  IsYTD2YearAvgNetIncomeCommission: boolean;
  IsMonthlyCheckDD: boolean;
  IsIncomeFrom1099: boolean;
  IsYTDOtherIncomeOne: boolean;
  IsYTD1YearAvgOtherIncome: boolean;
  IsYTD2YearAvgOtherIncome: boolean;
  Is12MonthAvg: boolean;
  Is24MonthAvg: boolean;
}


export const DataStatus: Status[] = [{ id: "Active", text: "Active" }, { id: "Inactive", text: "Inactive" }];
export const DataLoginBy: Status[] = [{ id: "Google", text: "Google" }, { id: "Outlook", text: "Outlook" }, { id: "MSuite", text: "MSuite" }];
export const FTPOptionsList: Status[] = [{ id: "SFTP", text: "SFTP" }, { id: "FTP", text: "FTP" }, { id: "AWS S3", text: "AWS S3" }, { id: "Azure Blob", text: "Azure Blob" }];