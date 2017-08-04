// import 'babel-polyfill';
/**
 * https://github.com/Keyamoon/svgxuse
 * If you do not use SVG <use xlink:href="…"> elements, remove svgxuse module
 */
import 'svgxuse';
import init from './init';
import factory from './factory';
import { render, renderFactory } from './render';

import disableEditBtn from './form/disableEditBtn';
import enableDisabledBtn from './form/enableDisabledBtn';
import AddressForm from './app-forms/AddressForm';
import B2cNameForm from './app-forms/B2cNameForm';
import ContactForm from './app-forms/ContactForm';
import NewsletterForm from './app-forms/NewsletterForm';
import SmeNameForm from './app-forms/SmeNameForm';

// import RegForm from './app-forms/RegistrationForm';
import RegistrationFormB2C from './app-forms/RegisterB2C';
import RegistrationFormSME from './app-forms/RegisterSME';
import PostRegistrationForm from './app-forms/CustomerPostRegisterUser';
import UsernameForgottenForm from './app-forms/CustomerUsernameForgotten';
import PasswordForgottenForm from './app-forms/CustomerPasswordForgotten';
import ResetPasswordForm from './app-forms/CustomerResetPassword';
import PasswordChangeForm from './app-forms/CustomerPasswordChange';
import AccountDeleteForm from './app-forms/CustomerAccountDelete';
import CihC from './remote-components/CihC';
import Ctl from './remote-components/Ctl';
import InvoiceDetailsCollection from './remote-components/InvoiceDetailsCollection';
import InBetweenInvoice from './app-forms/InBetweenInvoice';
import CorrectInvoice from './app-forms/CorrectInvoice';
import FeedbackForm from './app-forms/FeedbackForm';

/* For FE debugging */
init(PostRegistrationForm, document.querySelector('#CustomerPostRegisterUser'), innogyForm.CustomerPostRegisterUser);
init(UsernameForgottenForm, document.querySelector('#UsernameForgotten'), innogyForm.UsernameForgotten);
init(
    PasswordForgottenForm,
    document.querySelector('#CustomerPasswordForgotten'),
    innogyForm.CustomerPasswordForgotten
);
init(ResetPasswordForm, document.querySelector('#CustomerResetPassword'), innogyForm.CustomerResetPassword);
init(PasswordChangeForm, document.querySelector('#CustomerPasswordChange'), innogyForm.CustomerPasswordChange);
init(AccountDeleteForm, document.querySelector('#CustomerAccountDelete'), innogyForm.CustomerAccountDelete);

/* For BE rendering */
init(RegistrationFormB2C, document.querySelector('#RegisterB2C'), innogyForm.RegisterB2C);
init(RegistrationFormSME, document.querySelector('#RegisterSME'), innogyForm.RegisterSME);
// init(RegForm, document.querySelector('#RegisterSME'), innogyForm.RegisterSME);

init(
    PostRegistrationForm,
    document.querySelector('#B2CCustomerPostRegisterUser'),
    innogyForm.B2CCustomerPostRegisterUser
);

init(
    PostRegistrationForm,
    document.querySelector('#SMECustomerPostRegisterUser'),
    innogyForm.SMECustomerPostRegisterUser
);

init(PasswordChangeForm, document.querySelector('#B2CCustomerPasswordChange'), innogyForm.B2CCustomerPasswordChange);
init(PasswordChangeForm, document.querySelector('#SMECustomerPasswordChange'), innogyForm.SMECustomerPasswordChange);

init(AccountDeleteForm, document.querySelector('#B2CCustomerAccountDelete'), innogyForm.B2CCustomerAccountDelete);
init(AccountDeleteForm, document.querySelector('#SMECustomerAccountDelete'), innogyForm.SMECustomerAccountDelete);

// MOVED TO REDUX:
// init(ContactForm, document.querySelector('#B2CCustomerContactData'), innogyForm.B2CCustomerContactData);
// init(ContactForm, document.querySelector('#SMECustomerContactData'), innogyForm.SMECustomerContactData);

init(SmeNameForm, document.querySelector('#SMECustomerName'), innogyForm.SMECustomerName);
init(B2cNameForm, document.querySelector('#B2CCustomerName'), innogyForm.B2CCustomerName);

init(AddressForm, document.querySelector('#B2CCustomerAddress'), innogyForm.B2CCustomerAddress);
init(AddressForm, document.querySelector('#SMECustomerAddress'), innogyForm.SMECustomerAddress);

// MOVED TO REDUX:
// init(NewsletterForm, document.querySelector('#SMENewsletterRegister'), innogyForm.SMENewsletterRegister);
// init(NewsletterForm, document.querySelector('#B2CNewsletterRegister'), innogyForm.B2CNewsletterRegister);

factory(Ctl, document.querySelectorAll('[remoteComponent="ctl01"]'), components.ctl01);
init(CihC, document.querySelector('[data-tpl-component="cih01c"]'), components.cih01c);

init(
    InvoiceDetailsCollection,
    document.querySelector('[remoteComponent="invoiceDetailsCollection"]'),
    components.invoiceDetailsCollection
);

init(
    InBetweenInvoice,
    document.querySelector('#InvoiceInBetweenForm'),
    innogyMultistepForm.InvoiceInBetweenForm
);

init(
    CorrectInvoice,
    document.querySelector('#CorrectInvoiceForm'),
    innogyMultistepForm.CorrectInvoiceForm
);

init(FeedbackForm, document.querySelector('#B2CFeedbackForm'), innogyForm.B2CFeedbackForm);
init(FeedbackForm, document.querySelector('#SMEFeedbackForm'), innogyForm.SMEFeedbackForm);

import configureStore from './store/configureStore';
import PlusOne from './app-forms/components/Plus-one/PlusOne';
import Jfc from './app-forms/Jfc';
import { civilizeFormDefinition } from './helpers';

// REDUX:
const app = (config) => {
    const store = configureStore(config);

    // for testing redux:
    // renderFactory(PlusOne, document.querySelectorAll('.plus-one'), {}, store);

    // DFD 2173: temporary disable:
    // renderFactory(Jfc, document.querySelectorAll('[remoteComponent="jfc01"]'), {}, store);

    // BUG 4770:
    render(
        ContactForm,
        document.querySelector('#B2CCustomerContactData'),
        { formDefinition: civilizeFormDefinition(innogyForm.B2CCustomerContactData) },
        store
    );
    render(
        ContactForm,
        document.querySelector('#SMECustomerContactData'),
        { formDefinition: civilizeFormDefinition(innogyForm.SMECustomerContactData) },
        store
    );
    render(
        NewsletterForm,
        document.querySelector('#B2CNewsletterRegister'),
        { formDefinition: civilizeFormDefinition(innogyForm.B2CNewsletterRegister) },
        store
    );
    render(
        NewsletterForm,
        document.querySelector('#SMENewsletterRegister'),
        { formDefinition: civilizeFormDefinition(innogyForm.SMENewsletterRegister) },
        store
    );
};

app(window.config);
// :REDUX

/* need to run after forms and buttons are rendered */
factory(disableEditBtn, document.querySelectorAll('.formEdit__edit'));
factory(enableDisabledBtn, document.querySelectorAll('.formEdit__cancel'));
