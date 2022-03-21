using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{

    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<MemberDTO>> GetUsers()
        {
            var usersToReturn = _userRepository.GetMembersAsync();
            return await usersToReturn;
        }


        [HttpGet("{username}", Name ="GetUser")]
        public async Task<ActionResult<MemberDTO>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            //var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //Instead above code I use an implemented extensions for ClaimsPrincipal
            //var user = await _userRepository.GetUserByUsernameAsync(username);
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            _mapper.Map(memberUpdateDTO, user);

            Console.WriteLine(user);

            _userRepository.Update(user);
            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDTO>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var result = await _photoService.AddPhotoAsync(file);
            if(result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url= result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            if(user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }
            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync())
            {
                //return _mapper.Map<PhotoDTO>(photo);
                return CreatedAtRoute("GetUser",new {username = user.UserName}, _mapper.Map<PhotoDTO>(photo));
            }
            return BadRequest("Problem accured during adding photo");

        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var currentMainPhoto = user.Photos.FirstOrDefault(photo => photo.IsMain);
            var intendedPhoto = user.Photos.FirstOrDefault(photo => photo.Id == photoId); 
            if(currentMainPhoto.Id== photoId) return BadRequest("This is already your main photo");
            intendedPhoto.IsMain = true;
            if(currentMainPhoto != null) currentMainPhoto.IsMain = false;           
           if(await _userRepository.SaveAllAsync()) return  NoContent();
            return BadRequest("Erro occured during this procedure");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);
            if(photo == null) return NotFound();
            if(photo.IsMain) return BadRequest("You can't delete your main photo");

            if(photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if(await _userRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to delete photo");
        }
        
    }
}