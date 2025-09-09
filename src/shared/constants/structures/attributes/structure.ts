import { ExtractorAttributes } from "./extractor";
import { ManufacturerAttributes } from "./manufacturer";
import { SplitterAttributes } from "./splitter";
import { StorageContainerAttributes } from "./storage-container";
import { TransporterAttributes } from "./transporter";

export interface StructureAttributes
	extends TransporterAttributes,
		ExtractorAttributes,
		SplitterAttributes,
		ManufacturerAttributes,
		StorageContainerAttributes {}
