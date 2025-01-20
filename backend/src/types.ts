export enum OrderStatus {
    Planned = "planned",
    InProgress = "in_progress",
    Completed = "completed",
}

export enum TrackingStatus {
    RawMaterialLoaded = "raw_material_loaded",
    InProgress = "in_progress",
    Completed = "completed",
}

export interface ProductionStatus {
    status: OrderStatus;
    count: number;
}

export interface MachineUtilization {
    machine_id: number;
    utilization: number;
}

export interface DefectRate {
    total: number;
    fail: number;
    defectRate: number;
}

export interface DashboardData {
    productionStatus: ProductionStatus[];
    machineUtilization: MachineUtilization[];
    defectRate: DefectRate;
}

export interface ProductionOrder {
    readonly id?: number;
    product_id: number | null;
    quantity: number;
    status: OrderStatus;
    start_date?: Date;
    end_date?: Date;
    readonly created_at?: Date;
}

export interface ProductionTracking {
    readonly id?: number;
    order_id: number | null;
    machine_id: number | null
    operator_id: number | null;
    status: TrackingStatus;
    notes?: string;
    readonly created_at?: Date;
}

export interface QualityCheck {
    id?: number;
    order_id: number;
    check_type: string;
    result: "pass" | "fail";
    notes?: string;
    inspector_id?: number;
    created_at?: Date;
}

export interface Product {
    id?: number;
    name: string;
    description: string;
    unit_cost: number;
    production_time: number;
    required_materials: Array<{ material_id: number; quantity: number }>;
    created_at?: Date;
}