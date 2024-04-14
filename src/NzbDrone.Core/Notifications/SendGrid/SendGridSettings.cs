using System;
using System.Collections.Generic;
using FluentValidation;
using NzbDrone.Core.Annotations;
using NzbDrone.Core.Validation;

namespace NzbDrone.Core.Notifications.SendGrid
{
    public class SendGridSettingsValidator : AbstractValidator<SendGridSettings>
    {
        public SendGridSettingsValidator()
        {
            RuleFor(c => c.ApiKey).NotEmpty();
            RuleFor(c => c.From).NotEmpty().EmailAddress();
            RuleFor(c => c.Recipients).NotEmpty();
            RuleForEach(c => c.Recipients).NotEmpty().EmailAddress();
        }
    }

    public class SendGridSettings : NotificationBaseSettings
    {
        private static readonly SendGridSettingsValidator Validator = new SendGridSettingsValidator();

        public SendGridSettings()
        {
            BaseUrl = "https://api.sendgrid.com/v3/";
            Recipients = Array.Empty<string>();
        }

        public string BaseUrl { get; set; }

        [FieldDefinition(1, Label = "API Key", Privacy = PrivacyLevel.ApiKey, HelpText = "The API Key generated by SendGrid")]
        public string ApiKey { get; set; }

        [FieldDefinition(2, Label = "From Address")]
        public string From { get; set; }

        [FieldDefinition(3, Label = "Recipient Address(es)", Type = FieldType.Tag, Placeholder = "example@email.com,example1@email.com")]
        public IEnumerable<string> Recipients { get; set; }

        public override NzbDroneValidationResult Validate()
        {
            return new NzbDroneValidationResult(Validator.Validate(this));
        }
    }
}
