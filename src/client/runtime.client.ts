import { Flamework } from "@flamework/core";
import TransporterConnectionService from "./services/plot/transporter-connection-service";
import { Events } from "./network";

Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/client/components");
Flamework.addPaths("src/shared/components");
Flamework.ignite();
new TransporterConnectionService();
