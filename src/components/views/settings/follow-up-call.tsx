import React, { useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useExposure } from 'react-native-exposure-notification-service';

import { AppIcons } from 'assets/icons';
import { colors } from 'theme';
import { KeyboardScrollable } from 'components/templates/keyboard-scrollable';
import { Markdown } from 'components/atoms/markdown';
import { METRIC_TYPES, saveMetric } from 'services/api';
import { PhoneNumber } from 'components/organisms/phone-number';
import { Spacing } from 'components/atoms/layout';
import { Toast } from 'components/atoms/toast';

export const FollowUpCallSettings: React.FC = () => {
  const { t } = useTranslation();
  const { configure } = useExposure();

  const [confirmedChanges, setConfirmedChanges] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const successToast = confirmedChanges && (
    <Toast
      color="rgba(0, 207, 104, 0.16)"
      message={t('common:changesUpdated')}
      type="success"
      icon={<AppIcons.Success width={24} height={24} color={colors.success} />}
    />
  );

  return (
    <KeyboardScrollable toast={successToast} heading={t('followUpCall:title')} scrollViewRef={scrollViewRef}>
      <Markdown>{t('followUpCall:noteAlt')}</Markdown>
      <Spacing s={12} />
      <PhoneNumber
        buttonLabel={t('common:confirmChanges')}
        onSuccess={() => {
          scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
          setConfirmedChanges(true);
          saveMetric({ event: METRIC_TYPES.CALLBACK_OPTIN });
          configure();
        }}
        removeNumber={true}
      />
    </KeyboardScrollable>
  );
};
