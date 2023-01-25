import { Vertical } from "./constants";
import { Utils } from "./utils";
import * as fs from "fs";
import * as yaml from "js-yaml";
import fse from "fs-extra";
import path from "path";
import mustache from "mustache";
var readlineSync = require('readline-sync');

export async function integrate(
  vertical: string,
  yamlPath: string,
  graphql: string,
  dataSources?: Array<string>,
  templates?: Array<string>
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (!Utils.isVerticalSupported(vertical)) {
      console.error(`${vertical} vertical is not supported`);
      reject();
    }

    if (!Utils.fileExits(yamlPath)) {
      console.error(`YAML file ${yamlPath} does not exist.`);
      reject();
    }

    if (!Utils.fileExits(graphql)) {
      console.error(`GraphQL file ${graphql} does not exist.`);
      reject();
    }

    writeSubgraphYaml(vertical as Vertical, yamlPath, dataSources, templates)
      .then(() => {
        writeSubgraphGraphql(vertical as Vertical, graphql)
          .then(() => {
            const targetDirectory = copyAirstackModules(vertical as Vertical);

            if (vertical === Vertical.NftMarketplace) {
              getAirMetaDetails();
            }

            const arrayOfFiles: Array<string> = []
            getAllFiles(targetDirectory, arrayOfFiles)

            let dataSourceName = "";
            if (dataSources && dataSources.length > 0) {
              dataSourceName = dataSources[0];

            } else if (templates && templates.length > 0) {
              dataSourceName = templates[0];

            } else {
              const yamlSchemas = fs.readFileSync(yamlPath, "utf8");
              const sourceSubgraphYaml = yaml.load(yamlSchemas) as Record<string, any>;
              if (sourceSubgraphYaml.dataSources && sourceSubgraphYaml.dataSources.length > 0) {
                dataSourceName = sourceSubgraphYaml.dataSources[0].name;
              } else if (sourceSubgraphYaml.templates && sourceSubgraphYaml.templates.length > 0) {
                dataSourceName = sourceSubgraphYaml.templates[0].name;
              }
            }

            const writeFilePromise: Array<Promise<void>> = [];
            arrayOfFiles.forEach((filePath: string) => {
              writeFilePromise.push(new Promise((res, rej) => {
                const fileContent = fs.readFileSync(filePath, "utf8");
                const finalFileContent = mustache.render(fileContent, { dataSource: dataSourceName })

                fs.writeFile(filePath, finalFileContent, (err) => {
                  if (err) {
                    console.log(err);
                    rej();
                  } else {
                    res();
                  }
                });
              }));
            });
            Promise.all(writeFilePromise).then(() => {
              resolve();
            }).catch(() => {
              reject();
            })
          })
          .catch(() => {
            reject();
          });
      })
      .catch(() => {
        reject();
      });
  });
}

async function writeSubgraphYaml(
  vertical: Vertical,
  subgraphYamlPath: string,
  dataSource?: Array<string>,
  templates?: Array<string>
): Promise<void> {
  return new Promise((resolve, reject) => {
    const airstackYaml = Utils.getAirstackYamlForVertical(vertical);

    const sourceSchemas = fs.readFileSync(subgraphYamlPath, "utf8");
    const sourceSubgraphYaml = yaml.load(sourceSchemas) as Record<string, any>;

    let whiteListedDataSource = dataSource;
    if (!whiteListedDataSource) {
      whiteListedDataSource = sourceSubgraphYaml.dataSources.map(
        (dSrc: Record<string, any>) => dSrc.name
      );
    }

    let whiteListedTemplates = templates;
    if (sourceSubgraphYaml.templates && !whiteListedTemplates) {
      whiteListedTemplates = sourceSubgraphYaml.templates.map(
        (dSrc: Record<string, any>) => dSrc.name
      );
    }

    const targetSubgraphYaml = { ...sourceSubgraphYaml };
    const targetDataSources = targetSubgraphYaml.dataSources;
    targetDataSources.forEach((dataSrc: Record<string, any>) => {
      if (whiteListedDataSource!.includes(dataSrc.name)) {
        const existingEntities = [...dataSrc.mapping.entities];
        airstackYaml!.entities.forEach((airEntity: string) => {
          if (!existingEntities.includes(airEntity)) {
            dataSrc.mapping.entities.push(airEntity);
          }
        });

        const existingAbiNames = dataSrc.mapping.abis.map((abiObj: Record<string, string>) => {
          return abiObj.name;
        });
      }
    });

    if (targetSubgraphYaml.templates) {
      const targetTemplates = targetSubgraphYaml.templates;
      targetTemplates.forEach((dataSrc: Record<string, any>) => {
        if (whiteListedTemplates!.includes(dataSrc.name)) {
          const existingEntities = [...dataSrc.mapping.entities];
          airstackYaml!.entities.forEach((airEntity: string) => {
            if (!existingEntities.includes(airEntity)) {
              dataSrc.mapping.entities.push(airEntity);
            }
          });
          const existingAbiNames = dataSrc.mapping.abis.map((abiObj: Record<string, string>) => {
            return abiObj.name;
          });
        }
      });
    }


    Utils.backupFiles(subgraphYamlPath).then((isBackupSuccess: boolean) => {
      if (isBackupSuccess) {
        Utils.createFile(
          subgraphYamlPath,
          yaml.dump(targetSubgraphYaml, { lineWidth: -1, noRefs: true })
        ).then((isWriteSuccess: boolean) => {
          if (isWriteSuccess) {
            resolve();
          } else {
            reject();
          }
        });
      } else {
        reject();
      }
    });
  });
}

function writeSubgraphGraphql(
  vertical: Vertical,
  schemaGraphqlPath: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {

    const sourceSchemas = fs.readFileSync(schemaGraphqlPath, "utf8");
    if (sourceSchemas.includes("--Airstack Schemas--")) {
      return resolve();
    }

    const isBackupSuccess = await Utils.backupFiles(schemaGraphqlPath);
    if (!isBackupSuccess) {
      reject();
    }

    const schemas = Utils.getAirstackSchemasForVertical(vertical);
    const isAppendSuccess = await Utils.appendFiles(schemaGraphqlPath, schemas);
    if (!isAppendSuccess) {
      reject();
    }
    resolve();
  });
}

function copyAirstackModules(vertical: Vertical): string {
  switch (vertical) {
    case Vertical.NftMarketplace:
      return copyNftMarketplaceModules();
    case Vertical.DomainName:
      return copyDomainNameModules();
    default:
      console.error("Invalid vertical");
      return "";
  }
}

function copyNftMarketplaceModules(): string {
  const sourceDir = path.resolve(__dirname, '../../modules/airstack/nft-marketplace');
  const targetDir = path.resolve(__dirname, '../../../../../modules/airstack/nft-marketplace');

  // To copy a folder or file, select overwrite accordingly
  try {
    fse.copySync(sourceDir, targetDir, { overwrite: true })
  } catch (err) {
    console.error(err)
  } finally {
    return targetDir
  }
}

function copyDomainNameModules(): string {
  const sourceDir = path.resolve(__dirname, '../../modules/airstack/domain-name');
  const targetDir = path.resolve(__dirname, '../../../../../modules/airstack/domain-name');

  // To copy a folder or file, select overwrite accordingly
  try {
    fse.copySync(sourceDir, targetDir, { overwrite: true })
  } catch (err) {
    console.error(err)
  } finally {
    return targetDir
  }
}

function getAllFiles(dirPath: string, arrayOfFiles: Array<string>) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

export var SUBGRAPH_NAME = "";
export var SUBGRAPH_VERSION = "";
export var SUBGRAPH_SLUG = "";

function getAirMetaDetails() {
  while (SUBGRAPH_NAME.trim() === "") {
    let subgraphName: string = readlineSync.question("Enter the name of the subgraph: ");
    SUBGRAPH_NAME = subgraphName;
  }
  while (SUBGRAPH_VERSION.trim() === "") {
    let subgraphVersion: string = readlineSync.question("Enter the version of the subgraph: ");
    SUBGRAPH_VERSION = subgraphVersion;
  }
  while (SUBGRAPH_SLUG.trim() === "") {
    let subgraphSlug: string = readlineSync.question("Enter the slug of the subgraph: ");
    SUBGRAPH_SLUG = subgraphSlug;
  }
  const targetFile = path.resolve(__dirname, '../../../../../modules/airstack/utils.ts');
  let fileContent = fs.readFileSync(targetFile, { encoding: "utf8" });
  fileContent = fileContent.replace(/export const SUBGRAPH_NAME = ".*";/g, "");
  fileContent = fileContent.replace(/export const SUBGRAPH_VERSION = ".*";/g, "");
  fileContent = fileContent.replace(/export const SUBGRAPH_SLUG = ".*";/g, "");
  fileContent += `\nexport const SUBGRAPH_NAME = "${SUBGRAPH_NAME}";\nexport const SUBGRAPH_VERSION = "${SUBGRAPH_VERSION}";\nexport const SUBGRAPH_SLUG = "${SUBGRAPH_SLUG}";\n`
  fs.writeFileSync(targetFile, fileContent, { encoding: "utf8" });
}