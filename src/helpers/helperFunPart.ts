import { API } from 'aws-amplify';
import {
  PartT as Part,
  updatePart,
  listParts,
  getPart,
  ListPartsQuery,
  UpdatePartMutation,
  GetPartQuery,
  UpdatePartInput,
  partsByProviderID,
  PartsByProviderIDQuery,
} from '@/graphql';
import { uploadFileToS3 } from '@/helpers/s3';

export async function updateStatus(status: number, partID: any) {
  try {
    const updatedPart = (await API.graphql({
      query: updatePart,
      variables: {
        input: {
          id: partID,
          status: status,
        },
      },
    })) as { data: UpdatePartMutation };
  } catch (error) {
    console.error('Error updating part', error);
  }
}

export async function updateValidationChecks(
  partID: string,
  validations: {
    contactProvider: boolean;
    correctPart: boolean;
    partDelivered: boolean;
    partInstalled: boolean;
    partStatus: string;
    validatedAt: string;
    validatedBy: string;
  }
) {
  try {
    const updatedPart = (await API.graphql({
      query: updatePart,
      variables: {
        input: {
          id: partID,
          status: 9, // Status 9 indicates validation checks are complete
          workOrder: {
            observation: validations.partStatus,
            personInCharge: validations.validatedBy,
            jobToBeDone: `Validations completed at ${validations.validatedAt}. Contact: ${validations.contactProvider}, Correct: ${validations.correctPart}, Delivered: ${validations.partDelivered}, Installed: ${validations.partInstalled}`
          }
        },
      },
    })) as { data: UpdatePartMutation };
    
    return updatedPart.data.updatePart as Part;
  } catch (error) {
    console.error('Error updating validation checks:', error);
    throw error;
  }
}

export async function queryPart(partID: string) {
  try {
    // Get a specific item
    const onePart = (await API.graphql({
      query: getPart,
      variables: { id: partID },
    })) as { data: GetPartQuery };
    return onePart.data.getPart as Part;
  } catch (error) {
    console.error('Error querying one part:', error);
    throw error;
  }
}

export async function queryPartsByRange(status: number, maxStatus: number) {
  try {
    const allParts = (await API.graphql({
      query: listParts,
      variables: {
        filter: {
          and: [
            {
              status: { between: [status, maxStatus] },
            },
            {
              or: [
                { status: { ne: 6 } },
                { status: { ne: 7 } },
                { status: { ne: 9 } },
              ],
            },
          ],
        },
      },
    })) as { data: ListPartsQuery };

    if (!allParts.data.listParts?.items) return [];
    return allParts.data.listParts.items as Part[];
  } catch (error) {
    console.error('Error querying all parts:', error);
    throw error;
  }
}

export async function queryPartsByRangeWithFiltersCUR(
  status: number,
  maxStatus: number,
) {
  try {
    const allParts = (await API.graphql({
      query: listParts,
      variables: {
        filter: {
          and: [
            {
              status: {
                between: [status, maxStatus],
              },
            },
            {
              status: {
                not: {
                  in: [6, 7, 8],
                },
              },
            },
          ],
        },
      },
    })) as { data: ListPartsQuery };

    if (!allParts.data.listParts?.items) return [];
    return allParts.data.listParts.items as Part[];
  } catch (error) {
    console.error('Error querying all parts:', error);
    throw error;
  }
}

export async function queryPartsByStatusSpecific() {
  try {
    const allParts = (await API.graphql({
      query: listParts,
      variables: {
        filter: {
          status: {
            in: [6, 7, 8],
          },
        },
      },
    })) as { data: ListPartsQuery };

    if (!allParts.data.listParts?.items) return [];
    return allParts.data.listParts.items as Part[];
  } catch (error) {
    console.error('Error querying specific parts by status:', error);
    throw error;
  }
}

export async function queryPartsForProvider(providerID: string) {
  if (!providerID) {
    throw new Error('Provider ID is required');
  }

  try {
    const allParts = (await API.graphql({
      query: partsByProviderID,
      variables: {
        providerID: providerID,
        filter: {
          status: {
            between: [8, 12], // Include all relevant statuses for providers
          },
        },
      },
    })) as { data: PartsByProviderIDQuery };

    if (!allParts.data.partsByProviderID?.items) {
      return [];
    }

    // Filter out null items and sort by status
    return allParts.data.partsByProviderID.items
      .filter((item): item is Part => item !== null)
      .sort((a, b) => (a.status || 0) - (b.status || 0));
      
  } catch (error) {
    console.error('Error querying provider parts:', error);
    throw new Error('Failed to fetch provider parts');
  }
}

export async function queryPartsByStatus(status: number) {
  try {
    const allParts = (await API.graphql({
      query: listParts,
      variables: {
        filter: {
          status: {
            eq: status,
          },
        },
      },
    })) as { data: ListPartsQuery };

    if (!allParts.data.listParts?.items) return [];
    return allParts.data.listParts.items as Part[];
  } catch (error) {
    console.error('Error querying all parts:', error);
    throw error;
  }
}

export async function queryPartsByTime(initialTime: any, finalTime: any) {
  try {
    const allParts = (await API.graphql({
      query: listParts,
      variables: {
        filter: {
          reqDate: {
            between: [initialTime, finalTime],
          },
        },
      },
    })) as { data: ListPartsQuery };

    if (!allParts.data.listParts?.items) return [];
    const parts = allParts.data.listParts.items as Part[];

    const idArray = parts.map((part) => {
      if (part?.id) return part.id as string;
      else return '';
    });

    return idArray;
  } catch (error) {
    console.error('Error querying all parts:', error);
    throw error;
  }
}

export async function getUnitName(
  part: Part,
  setUnitName: (unit: string) => void,
) {
  if (!part) return;
  const unit = part.Unit.name;

  if (!unit) return;
  setUnitName(unit);
  return;
}

export async function updateFailureReport(update: UpdatePartInput) {
  try {
    const updatedPart = (await API.graphql({
      query: updatePart,
      variables: {
        input: {
          id: update.id,
          status: update.status,
          reqDate: update.reqDate,
          failureReport: {
            problemLocation: update.failureReport?.problemLocation,
            operator: update.failureReport?.operator,
            description: update.failureReport?.description,
          },
        },
      },
    })) as { data: UpdatePartMutation };
  } catch (error) {
    console.error('Error updating part', error);
  }
}

export async function updateWorkOrder(update: UpdatePartInput) {
  try {
    const updatedPart = (await API.graphql({
      query: updatePart,
      variables: {
        input: {
          id: update.id,
          status: update.status,
          workOrder: {
            jobToBeDone: update.workOrder?.jobToBeDone,
            personInCharge: update.workOrder?.personInCharge,
            sparePart: update.workOrder?.sparePart,
            observation: update.workOrder?.observation,
          },
        },
      },
    })) as { data: UpdatePartMutation };
  } catch (error) {
    console.error('Error updating part', error);
  }
}

export async function updatePartReq(updated: UpdatePartInput) {
  try {
    const updatedPart = (await API.graphql({
      query: updatePart,
      variables: {
        input: {
          id: updated.id,
          status: updated.status,
          partReq: {
            partDescription: updated.partReq?.partDescription,
            price: updated.partReq?.price,
            unitaryPrice: updated.partReq?.unitaryPrice,
            quantity: updated.partReq?.quantity,
            isCash: updated.partReq?.isCash,
            isImportant: updated.partReq?.isImportant,
          },
        },
      },
    })) as { data: UpdatePartMutation };
  } catch (error) {
    console.error('Error updating part', error);
  }
}

export async function updateMechanicReview(updated: UpdatePartInput) {
  try {
    const updatedPart = (await API.graphql({
      query: updatePart,
      variables: {
        input: {
          id: updated.id,
          status: updated.status,
          mechanicReview: {
            mechanic: updated.mechanicReview?.mechanic,
          },
        },
      },
    })) as { data: UpdatePartMutation };
  } catch (error) {
    console.error('Error updating part', error);
  }
}

export async function updateInvoiceInfo(updated: UpdatePartInput) {
  try {
    const updatedPart = (await API.graphql({
      query: updatePart,
      variables: {
        input: {
          id: updated.id,
          status: updated.status,
          invoiceInfo: {
            number: updated.invoiceInfo?.number,
            date: updated.invoiceInfo?.date,
            subTotal: updated.invoiceInfo?.subTotal,
          },
        },
      },
    })) as { data: UpdatePartMutation };
  } catch (error) {
    console.error('Error updating part', error);
    throw error;
  }
}

export async function setPartProvider(partID: string, providerID: string) {
  try {
    const updatedPart = (await API.graphql({
      query: updatePart,
      variables: {
        input: {
          id: partID,
          providerID: providerID,
        },
      },
    })) as { data: UpdatePartMutation };

    return updatedPart.data.updatePart as Part;
  } catch (error) {
    console.error('Error updating part', error);
    throw error;
  }
}

export async function sendApprovedEmail(partID: string) {
  const key = `adminApproval/${partID}`;
  // Create a Blob as a mock file content
  const blob = new Blob(['Mock File Content'], { type: 'text/plain' });

  // Create a File object from the Blob
  const mockFile = new File([blob], 'mock-file.txt', {
    type: 'text/plain',
  });

  try {
    await uploadFileToS3(mockFile, key);
  } catch (error) {
    alert(
      'El proveedor no ha sido notificado debido a un error, favor de notificarlo manualmente',
    );
  }
}