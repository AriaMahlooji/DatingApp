using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDTO
    {
        [Required(ErrorMessage="Username is required")]
        public string Username { get; set; }

        [Required(ErrorMessage ="Password is required")]
        [StringLength(8,MinimumLength =4)]
        public string Password { get; set; }
    }
}