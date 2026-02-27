import { Component } from "@flamework/components";
import TransporterComponent from "./transporter";
import { Solid } from "shared/constants/items";
import { OnStart } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";

@Component({tag:"TrackedTransporter"})
export default class TrackedTransporterComponent extends TransporterComponent implements OnStart {
    protected override readonly janitor=new Janitor<{"Soli,"FldInput":thread,"SolidOutput":threaduidInput":thread,"FluidOutput":thread}>()
    protected readonly trackingWindow:number=8;
    protected readonly solidInputs:[Solid,number][]=[];
    protected readonly solidOutputs:[Solid,number][]=[];
    protected readonly fluidInputs:[number,number][]=[];
    protected readonly fluidOutputs:[number,number][]=[];

    protected override initEvents(): void {
        super.initEvents();
        this.janitor.Add(()=>{
            this.solidInputs.clear();
            this.solidOutputs.clear();
            this.fluidInputs.clear();
            this.fluidOutputs.clear();
        })        
    }

    public override inputItem(solid: Solid): void;
    public override inputItem(fluid: string, volume: number): void;
    public override inputItem(item: Solid | string, volume?: number): void {
        if(typeIs(item,"table")){
            super.inputItem(item);
            this.solidInputs.push([item,time()]);
            this.janitor.Add(task.delay(this.trackingWindow,()=>{this.solidInputs.clear()}),true,"SolidInput")
        }
        else{
            super.inputItem(item,volume!);
            const lastFluidInput=this.fluidInputs[this.fluidInputs.size()-1]
            if(lastFluidInput!==undefined&&time()-lastFluidInput[1]<=.1){
                lastFluidInput[0]+=volume!
            }
            else{
                this.fluidInputs.push([volume!,time()]);
            }
            this.janitor.Add(task.delay(this.trackingWindow,()=>{this.fluidInputs.clear()}),true,"FluidInput")
            
        }
    }


    public override outputItem(solid: Solid): void;
    public override outputItem(fluid: string, volume: number): void;
    public override outputItem(item: Solid | string, volume?: number): void {
         if(typeIs(item,"table")){
            super.outputItem(item);
            this.solidOutputs.push([item,time()])
            this.janitor.Add(task.delay(this.trackingWindow,()=>{this.solidOutputs.clear()}),true,"SolidOutput")
        }
        else{
            super.outputItem(item,volume!);
            const lastFluidOutput=this.fluidOutputs[this.fluidOutputs.size()-1]
            if(lastFluidOutput!==undefined&&time()-lastFluidOutput[1]<=.1){
                lastFluidOutput[0]+=volume!
            }
            else{
                this.fluidOutputs.push([volume!,time()]);
            }
            this.janitor.Add(task.delay(this.trackingWindow,()=>{this.fluidOutputs.clear()}),true,"FluidOutput")
        }
    }

    private updateRate(list:[Solid,number][]|[number,number][]):void{
        while(list.size()>0&&time()-list[0][1]>this.trackingWindow){
            list.shift();
        }
    }

    public getInputRate(inputRateType:"Solid"|"Fluid"):number{
        this.updateRate(inputRateType==="Solid"?this.solidInputs:this.fluidInputs);
        return inputRateType==="Solid"?(this.solidInputs.size()/this.trackingWindow*60):this.fluidInputs.reduce((volume,[volume_])=>volume+=volume_,0)/this.trackingWindow*60
    }

    public getOutputRate(outputRateType:"Solid"|"Fluid"):number{
        this.updateRate(outputRateType==="Solid"?this.solidOutputs:this.fluidOutputs);
        return outputRateType==="Solid"?(this.solidOutputs.size()/this.trackingWindow*60):this.fluidOutputs.reduce((volume,[volume_])=>volume+=volume_,0)/this.trackingWindow*60
    }
}
