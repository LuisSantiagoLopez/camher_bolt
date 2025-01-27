import { API } from 'aws-amplify';
import {
  ProviderT,
  listProviders,
  ListProvidersQuery,
  updateProvider as updateProviderM,
  UpdateProviderMutation,
} from '@/graphql';

export const setNewProviderEmails = async (id: string, newEmails: string[]) => {
  try {
    const mutationRes = (await API.graphql({
      query: updateProviderM,
      variables: {
        input: {
          id: id,
          emails: newEmails,
        },
      },
    })) as { data: UpdateProviderMutation };

    return mutationRes.data.updateProvider as ProviderT;
  } catch (error) {
    console.error('Error updating provider emails:', error);
    throw error;
  }
};

export const queryAllProvider = async (): Promise<ProviderT[]> => {
  try {
    const queryAllProviders = (await API.graphql({
      query: listProviders,
    })) as { data: ListProvidersQuery };

    // Items can be (ProviderT | null)[], so filter out null
    const providerItems = queryAllProviders.data.listProviders?.items || [];
    const filteredProviders = providerItems.filter(Boolean) as ProviderT[];

    // If you truly need to remove `__typename`, you can do a map here:
    // But note that if you do so, you must define a separate return type or
    // handle the mismatch carefully. If you do not *need* to strip it, omit this.
    // const sanitizedProviders = filteredProviders.map(p => omitTypename(p));

    return filteredProviders;
  } catch (error) {
    console.error('Error querying all providers:', error);
    throw error;
  }
};


export const queryProviderByEmail = async (email: string): Promise<ProviderT> => {
  if (!email) throw new Error('Email is required');
  
  try {
    const allProviders = await queryAllProvider();
    if (!allProviders?.length) {
      throw new Error('No providers found');
    }

    const providersByEmail = allProviders.filter((provider) =>
      provider && provider.emails?.includes(email)
    );

    if (!providersByEmail?.length) {
      throw new Error('No provider found with this email');
    }

    return providersByEmail[0];
  } catch (e) {
    console.error('Error querying providers:', e);
    throw e;
  }
};