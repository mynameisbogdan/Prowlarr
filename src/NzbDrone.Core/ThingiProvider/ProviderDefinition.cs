using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Equ;
using NzbDrone.Core.Datastore;

namespace NzbDrone.Core.ThingiProvider
{
    public abstract class ProviderDefinition : ModelBase, IEquatable<ProviderDefinition>
    {
        private static readonly MemberwiseEqualityComparer<ProviderDefinition> Comparer = MemberwiseEqualityComparer<ProviderDefinition>.ByFields;

        protected ProviderDefinition()
        {
            Tags = new HashSet<int>();
        }

        private IProviderConfig _settings;

        public string Name { get; set; }

        [JsonIgnore]
        [MemberwiseEqualityIgnore]
        public string ImplementationName { get; set; }

        public string Implementation { get; set; }
        public string ConfigContract { get; set; }
        public virtual bool Enable { get; set; }
        public ProviderMessage Message { get; set; }
        public HashSet<int> Tags { get; set; }

        [MemberwiseEqualityIgnore]
        public IProviderConfig Settings
        {
            get => _settings;
            set
            {
                _settings = value;
                if (value != null)
                {
                    ConfigContract = value.GetType().Name;
                }
            }
        }

        public bool Equals(ProviderDefinition other)
        {
            return Comparer.Equals(this, other);
        }

        public override bool Equals(object obj)
        {
            return Equals(obj as ProviderDefinition);
        }

        public override int GetHashCode()
        {
            return Comparer.GetHashCode(this);
        }
    }
}
