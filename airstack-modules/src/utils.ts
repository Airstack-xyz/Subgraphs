import { SupportedVerticals, Vertical } from "./constants";
import * as fs from "fs";
import * as yaml from "js-yaml";
import dexSchema from "../graphql/airstack-dex-schema.graphql";
import nftMarketPlaceSchema from "../graphql/airstack-nft-marketplace-schema.graphql";
import domainNameSchema from "../graphql/airstack-domain-name-schema.graphql";
import socialSchema from "../graphql/airstack-social-schema.graphql";
import poapSchema from "../graphql/airstack-poap-schema.graphql"

import dexYamlString from "../yamls/dex.yaml";
import nftMarketPlaceYamlString from "../yamls/nft-marketplace.yaml";
import domainNameYamlString from "../yamls/domain-name.yaml";
import socialYamlString from "../yamls/social.yaml";
import poapYamlString from "../yamls/poap.yaml"

export namespace Utils {
  export function isVerticalSupported(verticalName: string): boolean {
    return SupportedVerticals.includes(verticalName.toLowerCase());
  }

  export function fileExits(filePath: string): boolean {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      return fileContent.length > 0;
    } catch (err) {
      return false;
    }
  }

  export function getAirstackYamlForVertical(
    verticalName: Vertical
  ): Record<string, any> | null {
    if (!isVerticalSupported(verticalName)) {
      throw new Error(`Unsupported vertical ${verticalName}`);
    }

    let yamlString: string | null = null;
    switch (verticalName) {
      case Vertical.Dex:
        yamlString = dexYamlString;
        break;
      case Vertical.NftMarketplace:
        yamlString = nftMarketPlaceYamlString;
        break;
      case Vertical.DomainName:
        yamlString = domainNameYamlString;
        break;
      case Vertical.Social:
        yamlString = socialYamlString;
        break;
      case Vertical.Poap:
        yamlString = poapYamlString;
        break;
      default:
        break;
    }
    if (yamlString !== null) {
      return yaml.load(yamlString) as Record<string, any>;
    } else {
      return null;
    }
  }

  export function getAirstackSchemasForVertical(
    verticalName: Vertical
  ): string {
    if (!isVerticalSupported(verticalName)) {
      throw new Error(`Unsupported vertical ${verticalName}`);
    }
    switch (verticalName) {
      case Vertical.Dex:
        return dexSchema;
      case Vertical.NftMarketplace:
        return nftMarketPlaceSchema;
      case Vertical.DomainName:
        return domainNameSchema;
      case Vertical.Social:
        return socialSchema;
      case Vertical.Poap:
        return poapSchema;
      default:
        break;
    }
    return "";
  }

  export function backupFiles(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sourceContent = fs.readFileSync(filePath, "utf8");
      fs.writeFile(`${filePath}.bck`, sourceContent, (err) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  export function appendFiles(
    filePath: string,
    content: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.appendFile(filePath, content, (err) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  export function overwriteFile(
    filePath: string,
    content: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, (err) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  export function createFile(
    filePath: string,
    content: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, (err) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
