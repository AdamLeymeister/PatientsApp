/*using Models.Domain.File;
using Models.Domain.Medications;
using Models.Domain.Users;
using Models.Requests.File;
using Models.Requests.Location;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;*/

namespace Models.Requests.HorseProfiles
{
    public class HorseAddRequest
    {
        [Required(ErrorMessage = "Name is Required")]
        [StringLength(100, MinimumLength = 1)]
        public string Name { get; set; }
        [Required(ErrorMessage = "Age is Required")]
        [Range(1, int.MaxValue)]
        public decimal Age { get; set; }
        [Required(ErrorMessage = "Gender is Required")]
        public bool IsFemale { get; set; }
        [Required(ErrorMessage = "Color is Required")]
        [StringLength(50, MinimumLength = 1)]
        public string Color { get; set; }
        [Required(ErrorMessage = "Weight is Required")]
        [Range(1, int.MaxValue)]
        public decimal Weight { get; set; }
        public string PrimaryImageUrl { get; set; }
        [Required(ErrorMessage = "Consent is Required")]
        public bool HasConsent { get; set; }
        [Required(ErrorMessage = "Breed Required")]
        [Range(1, int.MaxValue)]
        public int BreedTypeId { get; set; }
        [Required(ErrorMessage = "Location Required")]
        public int HorseLocationId { get; set; }
        public int[] HorseFiles { get; set; }
        public List<Medication> HorseMedications { get; set; }
        public int[] HorseUsers { get; set; }
    }
}
