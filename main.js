import random
from discord.ext import commands
import time
import asyncio

# Token
token = '<your bot token>'
# Prefix for your commands
client = commands.Bot(command_prefix="<prefix>")


# When your bot is ready
# Clears Discord chat and send a message to tell you it's up and ready to use
@client.event
async def on_ready():
  channel = client.get_channel(<channel_id>)
  await channel.purge(limit=10_000)
  await channel.send('''```
  ___                           _ _               __  
 |_ _|   __ _ _ __ ___     __ _| (_)_   _____   _ \ \ 
  | |   / _` | '_ ` _ \   / _` | | \ \ / / _ \ (_) | |
  | |  | (_| | | | | | | | (_| | | |\ V |  __/  _  | |
 |___|  \__,_|_| |_| |_|  \__,_|_|_| \_/ \___| (_) | |
                                                  /_/ 

```''')

# Log text messages
@client.event
async def on_message(message):
    author = message.author
    content = message.content
    print('{}: {}'.format(author, content))  #Renvoie à la console nom + msg
    await client.process_commands(message)


# Init dice battle
# You can call this command by typing in discord chat "<your prefix>dice_battle"
@client.command()
async def dice_battle(ctx):
  channel = ctx.channel
  author_id = (ctx.author).id
  message = ctx.message
  await channel.send('<@!{}>, please tag someone :'.format(author_id))


  def check(message):
  # Checks that the message sent has at least one @mention in it
    if len(message.mentions)!=0:
      member_id = (message.mentions[0]).id  # Takes only the first's @mention ID
      assert member_id != (message.author).id  # An error occurs if the mention is the same person that typed the command
      return True
    return False


	# Waits a message from the user
  # Open https://discordpy.readthedocs.io/en/latest/api.html and search anything that looks weird to you
  try :
    message = await client.wait_for("message", timeout=10, check=check)
  except asyncio.TimeoutError:
    await channel.send("<@!{}> you took too much time... Game cancelled".format((message.author).id))
    return
  except:
    await channel.send("You should consider finding yourself some friends...")
    return
		
  member = message.mentions[0]  # Extract Member object from the first mention
  await dice_cmd(ctx, member)
  

# The actual dice game
async def dice_cmd(ctx, member):
  channel = ctx.channel
  main_player_name = ctx.author
  tagged_player_name = member
  tagged_player_id = member.id
  await channel.send("Hey <@!{}> you got tagged in a duel".format(tagged_player_id))

  time.sleep(0.5)
  main_dice = random.randint(0, 6)
  await channel.send("{} launched the dice and got a {} !".format(main_player_name, main_dice))

  time.sleep(0.5)
  tagged_dice = random.randint(0, 6)
  await channel.send("{} launched the dice and got a {} !".format(tagged_player_name, tagged_dice))

  time.sleep(0.5)
  if main_dice > tagged_dice:
	  await channel.send("{} won !".format(main_player_name))
  elif main_dice < tagged_dice:
	  await channel.send("{} won !".format(tagged_player_name))
  else:
	  await channel.send("Wow ! It's a draw !")
  return


# Runs the bot
client.run(token)
