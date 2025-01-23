import { API } from 'aws-amplify';
import {
  Provider,
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

    return mutationRes.data.updateProvider as Provider;
  } catch (error) {
    console.error('Error updating provider emails:', error);
    throw error;
  }
};

export const queryAllProvider = async () => {
  try {
    const queryAllProviders = (await API.graphql({
      query: listProviders,
    })) as { data: ListProvidersQuery };
    return queryAllProviders?.data?.listProviders?.items as Provider[];
  } catch (error) {
    console.error('Error querying all providers:', error);
    throw error;
  }
};

export const queryProviderByEmail = async (email: string) => {
  try {
    const allProviders = await queryAllProvider();

    if (!allProviders || allProviders.length === 0) {
      throw new Error('No providers found');
    }

    const providersByEmail = allProviders.filter((provider) =>
      provider.emails?.includes(email),
    );

    if (!providersByEmail || providersByEmail.length === 0) {
      throw new Error('No provider found with this email');
    }
    return providersByEmail[0] as Provider;
  } catch (e) {
    console.error('Error querying the providers: ', e);
    throw e;
  }
};