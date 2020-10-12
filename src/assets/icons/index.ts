import { Platform } from 'react-native';

// app
import Alert from './app/alert.svg';
import ArrowRight from './app/arrow-right.svg';
import BackAndroid from './app/back-android.svg';
import BackIOS from './app/back-ios.svg';
import Bluetooth from './app/bluetooth.svg';
import Close from './app/close.svg';
import Notification from './app/notification.svg';
import Share from './app/share.svg';
import Success from './app/success.svg';

// bubble
import BubbleCases from './bubble/cases.svg';
import BubbleCheckIn from './bubble/check-in.svg';
import BubbleDeaths from './bubble/deaths.svg';
import BubbleHospital from './bubble/hospital.svg';
import BubbleICU from './bubble/icu.svg';
import BubbleMapPin from './bubble/map-pin.svg';
import BubblePhoneCall from './bubble/phone-call.svg';
import BubbleShield from './bubble/shield.svg';
import BubbleSurvey from './bubble/survey.svg';
import BubbleSymptom from './bubble/symptom.svg';
import BubbleRecovered from './bubble/recovered.svg';
import BubblePending from './bubble/pending.svg';
import BubbleTotal from './bubble/total.svg';
import BubbleNegative from './bubble/negative.svg';

// data
import DataNoId from './data/no-id.svg';
import DataNoLocation from './data/no-location.svg';
import DataNoPerson from './data/no-person.svg';
import DataPadlock from './data/padlock.svg';
import DataShield from './data/shield.svg';
import DataTrashCan from './data/trash-can.svg';

// tab-bar
import Updates from './tab-bar/updates.svg';
import CheckIn from './tab-bar/check-in.svg';
import ContactTracingOff from './tab-bar/contact-tracing-off.svg';
import ContactTracingOn from './tab-bar/contact-tracing-on.svg';
import ContactTracingUnknown from './tab-bar/contact-tracing-unknown.svg';
import SettingsAndroid from './tab-bar/settings-android.svg';
import SettingsIOS from './tab-bar//settings-ios.svg';
import Paused from './tab-bar/paused.svg';

// icons
import CheckMark from './check-mark.svg';
import CheckMarkMultiSelect from './check-mark-multiselect.svg';
import Logo from './logo.svg';
import LogoHeader from './jerseyHeaderLogo.svg';
import Privacy from './privacy.svg';
import RadioSelected from './radio-on.svg';

export const AppIcons = {
  Alert,
  ArrowRight,
  Back: Platform.OS === 'ios' ? BackIOS : BackAndroid,
  Bluetooth,
  Close,
  Notification,
  Share,
  Success
};

export const BubbleIcons = {
  Cases: BubbleCases,
  CheckIn: BubbleCheckIn,
  Deaths: BubbleDeaths,
  Hospital: BubbleHospital,
  ICU: BubbleICU,
  MapPin: BubbleMapPin,
  PhoneCall: BubblePhoneCall,
  Shield: BubbleShield,
  Survey: BubbleSurvey,
  Symptom: BubbleSymptom,
  Recovered: BubbleRecovered,
  Pending: BubblePending,
  Total: BubbleTotal,
  Negative: BubbleNegative
};

export const DataIcons = {
  NoId: DataNoId,
  NoLocation: DataNoLocation,
  NoPerson: DataNoPerson,
  Padlock: DataPadlock,
  Shield: DataShield,
  TrashCan: DataTrashCan
};

export const TabBarIcons = {
  Updates,
  CheckIn,
  ContactTracing: {
    Off: ContactTracingOff,
    On: ContactTracingOn,
    Unknown: ContactTracingUnknown,
    Paused
  },
  Settings: Platform.OS === 'ios' ? SettingsIOS : SettingsAndroid
};

export default {
  CheckMark,
  CheckMarkMultiSelect,
  Logo,
  LogoHeader,
  Privacy,
  RadioSelected
};
