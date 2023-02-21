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
            const { targetDir, commontTargetDir } = copyAirstackModules(vertical as Vertical);
            getAirMetaDetails(vertical as Vertical);
            const arrayOfFiles: Array<string> = []
            const arrayOfCommonFiles: Array<string> = []
            getAllFiles(targetDir, arrayOfFiles)
            getAllFiles(commontTargetDir, arrayOfCommonFiles)
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
                    console.error(err);
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
              console.error("Error while writing files")
              reject();
            })
            const writeCommonFilesPromise: Array<Promise<void>> = [];
            arrayOfCommonFiles.forEach((filePath: string) => {
              writeCommonFilesPromise.push(new Promise((res, rej) => {
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
            Promise.all(writeCommonFilesPromise).then(() => {
              resolve();
            }
            ).catch(() => {
              reject();
            })
          })
          .catch(() => {
            console.error("Error while writing graphql file");
            reject();
          });
      })
      .catch(() => {
        console.error("Error while writing yaml file");
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
        if (dataSrc.mapping.entities == null) {
          dataSrc.mapping.entities = airstackYaml!.entities;
        } else {
          const existingEntities = [...dataSrc.mapping.entities];
          airstackYaml!.entities.forEach((airEntity: string) => {
            if (!existingEntities.includes(airEntity)) {
              dataSrc.mapping.entities.push(airEntity);
            }
          });
        }
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
            console.error("Error while writing yaml file entities");
            reject();
          }
        });
      } else {
        console.error("Error while writing yaml file backup");
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

    const schemas = Utils.getAirstackSchemasForVertical(vertical);
    const sourceSchemas = fs.readFileSync(schemaGraphqlPath, "utf8");
    const schemasComment = "# --Airstack Schemas--"
    if (sourceSchemas.includes(schemasComment)) {
      // get line no of comment
      const indexOfComment = sourceSchemas.indexOf(schemasComment);
      // read all the schema above the comment
      const sourceSchemasAboveComment = sourceSchemas.substring(0, indexOfComment);
      // overwrite the file with the schema above the comment
      const isNonAirstackSchemaWriteSuccess = Utils.overwriteFile(schemaGraphqlPath, sourceSchemasAboveComment);
      if (!isNonAirstackSchemaWriteSuccess) {
        console.error("Failed to overwite the schema.graphql file");
        reject();
      }
      // append the airstack schemas
      const isAppendSuccess = await Utils.appendFiles(schemaGraphqlPath, schemas);
      if (!isAppendSuccess) {
        console.error("Failed to append airstack schemas to schema.graphql file after removing the existing airstack schemas")
        reject();
      }
      return resolve();
    }

    const isBackupSuccess = await Utils.backupFiles(schemaGraphqlPath);
    if (!isBackupSuccess) {
      console.error("Failed to backup schema.graphql file to schema.graphql.bck file")
      reject();
    }

    const isAppendSuccess = await Utils.appendFiles(schemaGraphqlPath, schemas);
    if (!isAppendSuccess) {
      console.error("Failed to append airstack schemas to schema.graphql file")
      reject();
    }
    resolve();
  });
}

function copyAirstackModules(vertical: Vertical): { targetDir: string, commontTargetDir: string } {
  let sourceDir: string = "";
  let targetDir: string = "";
  switch (vertical) {
    case Vertical.NftMarketplace:
      sourceDir = path.resolve(__dirname, '../../modules/airstack/nft-marketplace');
      targetDir = path.resolve(__dirname, '../../../../../modules/airstack/nft-marketplace');
      break;
    case Vertical.DomainName:
      sourceDir = path.resolve(__dirname, '../../modules/airstack/domain-name');
      targetDir = path.resolve(__dirname, '../../../../../modules/airstack/domain-name');
      break;
    default:
      console.error("Invalid vertical, please check the vertical name.");
      process.exit(1); // an error occurred
  }
  // to copy common.ts file
  const commontSourceDir = path.resolve(__dirname, '../../modules/airstack/common');
  const commontTargetDir = path.resolve(__dirname, '../../../../../modules/airstack/common');
  // To copy a folder or file, select overwrite accordingly
  try {
    fse.copySync(sourceDir, targetDir, { overwrite: true })
    fse.copySync(commontSourceDir, commontTargetDir, { overwrite: true })
  } catch (err) {
    console.error(err)
  } finally {
    return { targetDir, commontTargetDir };
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

function getAirMetaDetails(vertical: Vertical) {
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
  let targetFile = path.resolve(__dirname, '../../../../../modules/airstack/common/index.ts');
  let fileContent = fs.readFileSync(targetFile, { encoding: "utf8" });
  fileContent = fileContent.replace(/export const SUBGRAPH_NAME = ".*";/g, `export const SUBGRAPH_NAME = "${SUBGRAPH_NAME}";`);
  fileContent = fileContent.replace(/export const SUBGRAPH_VERSION = ".*";/g, `export const SUBGRAPH_VERSION = "${SUBGRAPH_VERSION}";`);
  fileContent = fileContent.replace(/export const SUBGRAPH_SLUG = ".*";/g, `export const SUBGRAPH_SLUG = "${SUBGRAPH_SLUG}";`);
  // fileContent += `\nexport const SUBGRAPH_NAME = "${SUBGRAPH_NAME}";\nexport const SUBGRAPH_VERSION = "${SUBGRAPH_VERSION}";\nexport const SUBGRAPH_SLUG = "${SUBGRAPH_SLUG}";\n`
  fs.writeFileSync(targetFile, fileContent, { encoding: "utf8" });
}