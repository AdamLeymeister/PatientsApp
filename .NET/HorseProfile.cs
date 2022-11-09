using Models.Domain.File;
using Models.Domain.Locations;
using Models.Domain.Medications;
using Models.Domain.Users;
using System.Collections.Generic;

namespace Models.Domain.HorseProfiles
{
    public class HorseProfile : BaseHorseProfile
    {
        public LookUp BreedTypeId { get; set; }
        public User OwnerInfo { get; set; }
        public Locations.Location HorseLocation { get; set; }
        public List<User> UserHorses { get; set; }
        public List<Medication> HorseMedications { get; set; }
        public List<FileModel> HorseFiles { get; set; }
    }
}
