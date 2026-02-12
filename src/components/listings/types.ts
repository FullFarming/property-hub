export interface FloorLeaseRow {
  id: string;
  floor: string;
  leaseArea: string;
  leaseAreaPyeong: string;
  tenantType: string;
  deposit: string;
  monthlyRent: string;
  maintenanceFee: string;
  note: string;
  isVacant: boolean;
  isHidden: boolean;
}

export interface LandParcel {
  id: string;
  dongJibun: string;
  areaSqm: string;
  areaPyeong: string;
  officialPriceSqm: string;
  officialPricePyeong: string;
  officialPriceTotal: string;
  landCategory: string;
  zoneType: string;
  usage: string;
  ownerType: string;
  ownerChangeDate: string;
  ownerChangeReason: string;
  roadFrontage: string;
  terrainHeight: string;
  terrainShape: string;
}

export interface BuildingInfo {
  id: string;
  dongJibun: string;
  dongName: string;
  floorsBelow: string;
  floorsAbove: string;
  mainUse: string;
  structure: string;
  landAreaSqm: string;
  landAreaPyeong: string;
  grossAreaSqm: string;
  grossAreaPyeong: string;
  buildingAreaSqm: string;
  buildingAreaPyeong: string;
  farAreaSqm: string;
  farAreaPyeong: string;
  isUnregistered: boolean;
  isViolation: boolean;
  isStrata: boolean;
}

export interface CustomerInfo {
  id: string;
  classification: string;
  grade: string;
  name: string;
  phone: string;
  homePhone: string;
  otherPhone: string;
  source: string;
  memo: string;
}

export interface ListingFormData {
  // 기본 정보
  isPublic: boolean;
  isRecommended: boolean;
  isExclusive: boolean;
  isUrgent: boolean;
  listingGrade: string;
  assignee: string;
  buildingName: string;
  status: string;
  classification: string;
  subClassifications: string[];

  // 위치 정보
  roadviewPublic: boolean;
  sido: string;
  gugun: string;
  dong: string;
  jibun: string;
  roadAddress: string;
  detailAddress: string;
  subwayInfo: string;
  locationVisibility: string;

  // 금액 정보
  commissionType: string;
  vatExcluded: boolean;
  salePrice: string;
  leasePrice: string;
  otherPrice: string;
  yieldRate: string;
  pricePerPyeong: string;
  deposit: string;
  monthlyRent: string;
  maintenanceFee: string;
  maintenanceExpense: string;
  maintenanceOther: string;

  // 토지 정보
  landParcels: LandParcel[];

  // 건축물대장
  buildings: BuildingInfo[];

  // 고객 정보
  customers: CustomerInfo[];

  // 층별 임대
  floorLeases: FloorLeaseRow[];

  // 상세 설명
  adTitle: string;
  description: string;
  features: string;
  secretMemo: string;
}

export const defaultFormData: ListingFormData = {
  isPublic: false,
  isRecommended: false,
  isExclusive: false,
  isUrgent: false,
  listingGrade: '',
  assignee: '',
  buildingName: '',
  status: '준비',
  classification: '',
  subClassifications: [],
  roadviewPublic: false,
  sido: '',
  gugun: '',
  dong: '',
  jibun: '',
  roadAddress: '',
  detailAddress: '',
  subwayInfo: '',
  locationVisibility: '공개',
  commissionType: '',
  vatExcluded: false,
  salePrice: '',
  leasePrice: '',
  otherPrice: '',
  yieldRate: '',
  pricePerPyeong: '',
  deposit: '',
  monthlyRent: '',
  maintenanceFee: '',
  maintenanceExpense: '',
  maintenanceOther: '',
  landParcels: [],
  buildings: [],
  customers: [],
  floorLeases: [],
  adTitle: '',
  description: '',
  features: '',
  secretMemo: '',
};

export const STATUSES = ['준비', '완료', '보류', '매각'] as const;

export const CLASSIFICATIONS = [
  '수익형', '꼬마빌딩', '대형빌딩', '사옥용', '투자용',
  '대로변 빌딩', '토지·신축부지', '호텔', '메디컬', '건물',
] as const;

export const SUB_CLASSIFICATIONS = [
  '역세권', '대로변', '신축', '50억미만', '100억이하', '200억이하', '300억이하',
  '공장물류창고', '구분상가', '기타', '리노베이션', '병원용',
  '사옥용추천', '수익용추천', '신축용추천', '주거용추천', '주유소', '투자용추천', '호텔모델',
] as const;

export const LAND_CATEGORIES = ['대', '전', '답', '임야', '잡종지', '도로', '하천', '구거', '공장용지'] as const;
export const ZONE_TYPES = ['일반상업지역', '근린상업지역', '준주거지역', '제2종일반주거', '제3종일반주거', '준공업지역', '전용주거지역'] as const;
export const ROAD_FRONTAGES = ['한면', '두면', '세면', '코너', '이면', '맹지'] as const;
export const TERRAIN_HEIGHTS = ['평지', '완경사', '급경사', '고지', '저지'] as const;
export const TERRAIN_SHAPES = ['정방형', '장방형', '사다리', '삼각형', '부정형', '자루형'] as const;
export const BUILDING_USES = ['제1종근린생활시설', '제2종근린생활시설', '업무시설', '판매시설', '숙박시설', '의료시설', '교육연구시설'] as const;
export const BUILDING_STRUCTURES = ['철근콘크리트구조', '철골구조', '철골철근콘크리트', '벽돌구조', '조적구조', '목구조'] as const;
