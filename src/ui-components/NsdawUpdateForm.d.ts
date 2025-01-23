/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { Nsdaw } from "../models";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type NsdawUpdateFormInputValues = {};
export declare type NsdawUpdateFormValidationValues = {};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type NsdawUpdateFormOverridesProps = {
    NsdawUpdateFormGrid?: FormProps<GridProps>;
} & EscapeHatchProps;
export declare type NsdawUpdateFormProps = React.PropsWithChildren<{
    overrides?: NsdawUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    nsdaw?: Nsdaw;
    onSubmit?: (fields: NsdawUpdateFormInputValues) => NsdawUpdateFormInputValues;
    onSuccess?: (fields: NsdawUpdateFormInputValues) => void;
    onError?: (fields: NsdawUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: NsdawUpdateFormInputValues) => NsdawUpdateFormInputValues;
    onValidate?: NsdawUpdateFormValidationValues;
}>;
export default function NsdawUpdateForm(props: NsdawUpdateFormProps): React.ReactElement;
