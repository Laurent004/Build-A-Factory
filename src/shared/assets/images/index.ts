export const IMAGES={
   context:{
      toolbar:{
         "Info":"rbxassetid://72348582600314",
         "Build":"rbxassetid://103412987990113",
         "Edit":"rbxassetid://96799868493522",
         "Copy":"rbxassetid://111924641760501",
         "Cleaner":"rbxassetid://78931093047640",
         "Delete":"rbxassetid://79359039506640",
      } as Record<string,string>,

      sections:{
         "Items":"rbxassetid://118136638604622",
      } as Record<string,string>,

   } as const satisfies Record<string,Record<string,string>>,

   structuresCategories:{
      "Transportation":"rbxassetid://90428632804219",
      "Production":"rbxassetid://83010542601929",
   } as const satisfies Record<string,string>,
     
   structures:{
      "Straight Conveyor":"rbxassetid://120272831036505",
      "Left Turn Conveyor":"rbxassetid://120272831036505",
      "Right Turn Conveyor":"rbxassetid://120272831036505",
      "Merger":"rbxassetid://120272831036505",
      "Splitter":"rbxassetid://120272831036505",
      "Extractor":"rbxassetid://120272831036505",
      "Smelter":"rbxassetid://120272831036505",
      "Assembler":"rbxassetid://120272831036505",
   } as Record<string,string>,

   items:{
      "Iron Ore": "rbxassetid://118137441817637",
      "Copper Ore": "rbxassetid://128912562458298",
      "Iron Ingot": "rbxassetid://118137441817637",
      "Copper Ingot": "rbxassetid://128912562458298",
      "Iron Plate": "rbxassetid://113068900881076",
   } as const satisfies Record<string,string>,

   panels:{
      splitter:{
         "None":"rbxassetid://133585488391616",
         "Any":"rbxassetid://133585488391616",
         "Overflow":"rbxassetid://133585488391616",
         "Any (undefined)":"rbxassetid://133585488391616",
      } as const satisfies Record<string,string>
   }
} as const