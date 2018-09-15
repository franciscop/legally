module.exports.name = 'BSD 2 Clause';

module.exports.regex = /(?:the )?bsd(?: license)/i;

// This is because this fragment belongs to the BSD 3 Clause, so while the above
//  regex matches, this will invalidate this whole match if found
module.exports.negate = /nor the names of its contributors may be used to endorse/;

module.exports.text = `
  redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  1. redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

  2. redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

  this software is provided by the copyright holders and contributors "as is"
  and any express or implied warranties, including, but not limited to, the
  implied warranties of merchantability and fitness for a particular purpose are
  disclaimed. in no event shall the copyright holder or contributors be liable
  for any direct, indirect, incidental, special, exemplary, or consequential
  damages (including, but not limited to, procurement of substitute goods or
  services; loss of use, data, or profits; or business interruption) however
  caused and on any theory of liability, whether in contract, strict liability,
  or tort (including negligence or otherwise) arising in any way out of the use
  of this software, even if advised of the possibility of such damage.
`;
