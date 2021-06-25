export class VehicleCount {
    VehicleName!:string;
    Count!:number;

    constructor(name: string,  count: number) {
        this.VehicleName = name;
        this.Count = count;
    }
}
