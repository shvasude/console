import * as React from 'react';
import { useTranslation } from 'react-i18next';
import * as cx from 'classnames';
import {
  Alert,
  AlertVariant,
  AlertActionLink,
  WizardContextConsumer,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { TechPreviewBadge } from '@console/shared';
import { CreateStepsSC } from '../constants';
import '../components/ocs-install/ocs-install.scss';
import { EncryptionType } from '../types';
import { TFunction } from 'i18next';

export type Validation = {
  title: React.ReactNode;
  text?: string;
  variant?: keyof typeof AlertVariant;
  link?: string;
  linkText?: string;
  actionLinkText?: string;
  actionLinkStep?: string;
};

export enum ValidationType {
  'MINIMAL' = 'MINIMAL',
  'INTERNALSTORAGECLASS' = 'INTERNALSTORAGECLASS',
  'BAREMETALSTORAGECLASS' = 'BAREMETALSTORAGECLASS',
  'ALLREQUIREDFIELDS' = 'ALLREQUIREDFIELDS',
  'MINIMUMNODES' = 'MINIMUMNODES',
  'ENCRYPTION' = 'ENCRYPTION',
  'REQUIRED_FIELD_KMS' = 'REQUIRED_FIELD_KMS',
  'NETWORK' = 'NETWORK',
  'INTERNAL_FLEXIBLE_SCALING' = 'INTERNAL_FLEXIBLE_SCALING',
  'ATTACHED_DEVICES_FLEXIBLE_SCALING' = 'ATTACHED_DEVICES_FLEXIBLE_SCALING',
}

export const VALIDATIONS = (type: keyof typeof ValidationType, t: TFunction): Validation => {
  switch (type) {
    case ValidationType.MINIMAL:
      return {
        variant: AlertVariant.warning,
        title: (
          <div className="ceph-minimal-deployment-alert__header">
            {t('ceph-storage-plugin~A minimal cluster deployment will be performed.')}
            <TechPreviewBadge />
          </div>
        ),
        text: t(
          'ceph-storage-plugin~The selected nodes do not match the OCS storage cluster requirement of an aggregated 30 CPUs and 72 GiB of RAM. If the selection cannot be modified a minimal cluster will be deployed.',
        ),
        actionLinkStep: CreateStepsSC.STORAGEANDNODES,
        actionLinkText: t('ceph-storage-plugin~Back to nodes selection'),
      };
    case ValidationType.INTERNALSTORAGECLASS:
      return {
        variant: AlertVariant.danger,
        title: t('ceph-storage-plugin~Select a storage class to continue'),
        text: t(
          'ceph-storage-plugin~This is a required field. The Storage Class will be used to request storage from the underlying infrastructure to create the backing persistent volumes that will be used to provide the OpenShift Container Storage (OCS) service.',
        ),
        link: '/k8s/cluster/storageclasses/~new/form',
        linkText: t('ceph-storage-plugin~Create new storage class'),
      };
    case ValidationType.BAREMETALSTORAGECLASS:
      return {
        variant: AlertVariant.danger,
        title: t('ceph-storage-plugin~Select a storage class to continue'),
        text: t(
          'ceph-storage-plugin~This is a required field. The Storage Class will be used to request storage from the underlying infrastructure to create the backing persistent volumes that will be used to provide the OpenShift Container Storage (OCS) service.',
        ),
      };
    case ValidationType.ALLREQUIREDFIELDS:
      return {
        variant: AlertVariant.danger,
        title: t('ceph-storage-plugin~All required fields are not set'),
        text: t(
          'ceph-storage-plugin~In order to create the storage cluster you must set the storage class select at least 3 nodes (preferably in 3 different zones) and meet the minimum or recommended requirement',
        ),
      };
    case ValidationType.MINIMUMNODES:
      return {
        variant: AlertVariant.danger,
        title: t('ceph-storage-plugin~Minimum Node Requirement'),
        text: t(
          'ceph-storage-plugin~The OCS Storage cluster require a minimum of 3 nodes for the initial deployment. Please choose a different storage class or go to create a new volume set that matches the minimum node requirement.',
        ),
        actionLinkText: t('ceph-storage-plugin~Create new volume set instance'),
        actionLinkStep: CreateStepsSC.DISCOVER,
      };
    case ValidationType.ENCRYPTION:
      return {
        variant: AlertVariant.danger,
        title: t('ceph-storage-plugin~All required fields are not set'),
        text: t('ceph-storage-plugin~Select at least 1 encryption level or disable encryption.'),
      };
    case ValidationType.REQUIRED_FIELD_KMS:
      return {
        variant: AlertVariant.danger,
        title: t(
          'ceph-storage-plugin~Fill out the details in order to connect to key management system',
        ),
        text: t('ceph-storage-plugin~This is a required field.'),
      };
    case ValidationType.NETWORK:
      return {
        variant: AlertVariant.danger,
        title: t('ceph-storage-plugin~Public Network Attachment Definition cannot be empty'),
        text: t(
          'ceph-storage-plugin~To use Multus networking the public Network Attachment Definition must be selected.',
        ),
      };
    case ValidationType.INTERNAL_FLEXIBLE_SCALING:
      return {
        variant: AlertVariant.info,
        title: t(
          'ceph-storage-plugin~The number of selected zones is less than the minimum requirement of 3. If not modified a host-based failure domain deployment will be enforced.',
        ),
      };
    case ValidationType.ATTACHED_DEVICES_FLEXIBLE_SCALING:
      return {
        variant: AlertVariant.info,
        title: t(
          'ceph-storage-plugin~When all the selected nodes in the storage class are in a single zone the cluster will be using a host-based failure domain.',
        ),
      };
    default:
      return { title: '', text: '' };
  }
};

export const ActionAlert: React.FC<ActionAlertProps> = ({
  variant = AlertVariant.info,
  title,
  text,
  actionLinkText,
  actionLinkStep,
  className,
}) => (
  <WizardContextConsumer>
    {({ goToStepById }) => (
      <Alert
        className={cx('co-alert', className)}
        variant={variant}
        title={title}
        isInline
        actionLinks={
          <AlertActionLink onClick={() => goToStepById(actionLinkStep)}>
            {actionLinkText}
          </AlertActionLink>
        }
      >
        <p>{text}</p>
      </Alert>
    )}
  </WizardContextConsumer>
);

type ActionAlertProps = Validation & {
  className?: string;
};

export const ValidationMessage: React.FC<ValidationMessageProps> = ({ className, validation }) => {
  const { t } = useTranslation();
  const {
    variant = AlertVariant.info,
    title,
    text,
    link,
    linkText,
    actionLinkStep,
    actionLinkText,
  } = VALIDATIONS(validation, t);
  return actionLinkStep ? (
    <Alert className={cx('co-alert', className)} variant={variant} title={title} isInline>
      <p>{text}</p>
      {link && linkText && <Link to={link}>{linkText}</Link>}
    </Alert>
  ) : (
    <ActionAlert
      title={title}
      text={text}
      variant={variant}
      actionLinkText={actionLinkText}
      actionLinkStep={actionLinkStep}
    />
  );
};

type ValidationMessageProps = {
  className?: string;
  validation: keyof typeof ValidationType;
};

export const getEncryptionLevel = (obj: EncryptionType, t: TFunction) => {
  if (obj.clusterWide && obj.storageClass) {
    return t('ceph-storage-plugin~Cluster-Wide and Storage Class');
  }
  if (obj.clusterWide) {
    return t('ceph-storage-plugin~Cluster-Wide');
  }
  return t('ceph-storage-plugin~Storage Class');
};
